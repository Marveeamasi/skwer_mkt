begin;

create unique index one_open_refund_per_order on public.refund_records(order_id)
  where status in('requested','submitted');

create or replace function public.complete_refund_record(
  p_refund uuid,
  p_provider_reference text,
  p_provider_summary jsonb
) returns text
language plpgsql security definer set search_path=public as $$
declare
  r public.refund_records%rowtype;
  p public.payments%rowtype;
  o public.orders%rowtype;
  order_refunded bigint;
  payment_refunded bigint;
  next_order_status public.order_status;
begin
  select * into r from public.refund_records where id=p_refund for update;
  if not found then raise exception 'refund_not_found'; end if;
  if r.status='processed' then
    select status into next_order_status from public.orders where id=r.order_id;
    return next_order_status::text;
  end if;
  select * into p from public.payments where id=r.payment_id for update;
  select * into o from public.orders where id=r.order_id for update;
  if not found or p.id is null then raise exception 'refund_payment_not_found'; end if;
  update public.refund_records set status='processed',provider_reference=coalesce(p_provider_reference,provider_reference),provider_summary=coalesce(p_provider_summary,'{}'),processed_at=now() where id=r.id;
  select coalesce(sum(amount_kobo),0) into order_refunded from public.refund_records where order_id=o.id and status='processed';
  select coalesce(sum(amount_kobo),0) into payment_refunded from public.refund_records where payment_id=p.id and status='processed';
  update public.payments set status=case when payment_refunded>=p.amount_kobo then 'refunded'::public.payment_status else 'partially_refunded'::public.payment_status end where id=p.id;
  next_order_status:=case when order_refunded>=o.total_paid_kobo then 'refunded'::public.order_status else 'partially_refunded'::public.order_status end;
  update public.orders set status=next_order_status where id=o.id;
  perform public.reverse_rewards_after_refund(o.id,'payment_refunded');
  insert into public.order_events(order_id,event_type,from_status,to_status,actor_type,public_message,private_metadata)
    values(o.id,'refund_processed',o.status::text,next_order_status::text,'paystack',case when next_order_status='refunded' then 'Refund processed' else 'Partial refund processed' end,jsonb_build_object('amount_kobo',r.amount_kobo,'provider_reference',p_provider_reference));
  return next_order_status::text;
end$$;

revoke all on function public.complete_refund_record(uuid,text,jsonb) from public,anon,authenticated;

commit;
