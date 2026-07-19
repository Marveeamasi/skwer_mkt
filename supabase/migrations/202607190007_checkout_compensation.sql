begin;

alter table public.payments add column order_payment_link_id uuid references public.order_payment_links(id);
create unique index one_open_payment_per_balance_link on public.payments(order_payment_link_id)
  where order_payment_link_id is not null and status in('initialized','pending','success');

create or replace function public.finish_balance_link_after_payment() returns trigger
language plpgsql set search_path=public as $$
begin
  if new.status='success' and new.order_payment_link_id is not null and old.status is distinct from new.status then
    update public.order_payment_links set status='used',used_at=coalesce(new.provider_paid_at,now())
      where id=new.order_payment_link_id and status='active';
  end if;
  return new;
end$$;
create trigger finish_balance_link_after_payment after update of status on public.payments
  for each row execute function public.finish_balance_link_after_payment();

create or replace function public.compensate_checkout_failure(p_order uuid,p_reason text) returns boolean
language plpgsql security definer set search_path=public as $$
declare
  o public.orders%rowtype;
  redemption public.reward_redemptions%rowtype;
  reservation record;
begin
  select * into o from public.orders where id=p_order for update;
  if not found then return false; end if;
  if o.status<>'payment_pending' or o.total_paid_kobo<>0 then return false; end if;

  for reservation in select * from public.inventory_reservations where order_id=o.id and status='active' for update loop
    update public.product_variants set reserved_quantity=greatest(0,reserved_quantity-reservation.quantity)
      where id=reservation.variant_id;
    update public.inventory_reservations set status='released' where id=reservation.id;
  end loop;

  if o.reward_redemption_id is not null then
    select * into redemption from public.reward_redemptions where id=o.reward_redemption_id for update;
    update public.orders set reward_redemption_id=null,discount_kobo=0,total_due_kobo=item_subtotal_kobo+delivery_fee_kobo where id=o.id;
    if found then
      update public.reward_credits set status='available',redeemed_at=null where id=redemption.reward_credit_id and status='redeemed';
      delete from public.reward_redemptions where id=redemption.id;
    end if;
  end if;

  update public.payments set status='failed',processed_at=now(),raw_verified_summary=jsonb_build_object('initialization_error',left(p_reason,500))
    where order_id=o.id and status in('initialized','pending');
  update public.referral_attributions set status='rejected',fraud_reason='checkout_initialization_failed'
    where order_id=o.id and status='checkout_started';
  update public.orders set status='payment_failed' where id=o.id;
  insert into public.order_events(order_id,event_type,from_status,to_status,actor_type,public_message,private_metadata)
    values(o.id,'checkout_initialization_failed',o.status::text,'payment_failed','system','Payment could not be started',jsonb_build_object('reason',left(p_reason,500)));
  return true;
end$$;

revoke all on function public.compensate_checkout_failure(uuid,text) from public,anon,authenticated;

commit;
