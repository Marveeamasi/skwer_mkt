begin;

create table public.order_payment_links(
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  public_token_hash text not null unique,
  payment_type text not null check(payment_type in('balance')),
  status text not null default 'active' check(status in('active','used','expired','revoked')),
  expires_at timestamptz not null,
  used_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create unique index one_active_balance_link_per_order
  on public.order_payment_links(order_id) where status='active';

create table public.refund_records(
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  payment_id uuid references public.payments(id),
  amount_kobo bigint not null check(amount_kobo>0),
  status text not null default 'requested' check(status in('requested','submitted','processed','failed','cancelled')),
  reason text not null,
  provider_reference text unique,
  requested_by uuid references public.profiles(id),
  provider_summary jsonb not null default '{}',
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.reward_review_flags(
  id uuid primary key default gen_random_uuid(),
  reward_credit_id uuid not null references public.reward_credits(id),
  order_id uuid not null references public.orders(id),
  reason text not null,
  status text not null default 'open' check(status in('open','resolved','dismissed')),
  resolved_by uuid references public.profiles(id),
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique(reward_credit_id,order_id,reason)
);

alter table public.order_payment_links enable row level security;
alter table public.refund_records enable row level security;
alter table public.reward_review_flags enable row level security;
revoke all on public.order_payment_links,public.refund_records,public.reward_review_flags from anon;

create policy seller_balance_links_read on public.order_payment_links for select to authenticated
  using(exists(select 1 from public.orders o where o.id=order_id and (o.seller_id=public.current_seller_id() or public.is_admin())));
create policy seller_refunds_read on public.refund_records for select to authenticated
  using(exists(select 1 from public.orders o where o.id=order_id and (o.seller_id=public.current_seller_id() or public.is_admin())));
create policy admin_reward_flags on public.reward_review_flags for all to authenticated
  using(public.is_admin()) with check(public.is_admin());

create or replace function public.redeem_reward_atomic(
  p_order uuid,
  p_reward_hash text,
  p_normalized_phone text
) returns bigint
language plpgsql security definer set search_path=public as $$
declare
  o public.orders%rowtype;
  r public.reward_credits%rowtype;
  owner_phone text;
  redeemed_amount bigint;
  redemption_id uuid;
begin
  select * into o from public.orders where id=p_order for update;
  if not found then raise exception 'order_not_found'; end if;
  if o.status<>'payment_pending' or o.total_paid_kobo<>0 then raise exception 'order_not_redeemable'; end if;
  if o.referred_by_referral_id is not null then raise exception 'reward_referral_conflict'; end if;
  if o.reward_redemption_id is not null then raise exception 'reward_already_applied'; end if;

  select * into r from public.reward_credits where public_code_hash=p_reward_hash for update;
  if not found then raise exception 'reward_not_found'; end if;
  select normalized_phone into owner_phone from public.customers where id=r.owner_customer_id;
  if r.status<>'available' then raise exception 'reward_unavailable'; end if;
  if r.seller_id<>o.seller_id then raise exception 'reward_wrong_seller'; end if;
  if owner_phone<>p_normalized_phone then raise exception 'reward_wrong_owner'; end if;
  if r.expires_at is not null and r.expires_at<=now() then
    update public.reward_credits set status='expired' where id=r.id;
    raise exception 'reward_expired';
  end if;

  redeemed_amount:=least(r.amount_kobo,o.item_subtotal_kobo+o.delivery_fee_kobo);
  if redeemed_amount<=0 then raise exception 'reward_has_no_value'; end if;
  insert into public.reward_redemptions(reward_credit_id,order_id,amount_kobo)
    values(r.id,o.id,redeemed_amount) returning id into redemption_id;
  update public.reward_credits set status='redeemed',redeemed_at=now() where id=r.id;
  update public.orders set reward_redemption_id=redemption_id,discount_kobo=redeemed_amount,
    total_due_kobo=greatest(0,item_subtotal_kobo+delivery_fee_kobo-redeemed_amount),reward_funding_kobo=0
    where id=o.id;
  insert into public.order_events(order_id,event_type,from_status,to_status,actor_type,public_message,private_metadata)
    values(o.id,'reward_redeemed',o.status::text,o.status::text,'buyer','Reward applied',jsonb_build_object('amount_kobo',redeemed_amount));
  return redeemed_amount;
end$$;

create or replace function public.expire_reward_credits() returns integer
language plpgsql security definer set search_path=public as $$
declare affected integer;
begin
  update public.reward_credits set status='expired'
    where status='available' and expires_at is not null and expires_at<=now();
  get diagnostics affected=row_count;
  return affected;
end$$;

create or replace function public.reverse_rewards_after_refund(p_order uuid,p_reason text) returns integer
language plpgsql security definer set search_path=public as $$
declare affected integer:=0;
begin
  update public.reward_credits set status='reversed'
    where source_order_id=p_order and status in('pending','available');
  get diagnostics affected=row_count;
  insert into public.reward_review_flags(reward_credit_id,order_id,reason)
    select id,p_order,p_reason from public.reward_credits
    where source_order_id=p_order and status='redeemed'
    on conflict(reward_credit_id,order_id,reason) do nothing;
  update public.referral_attributions set status='reversed',fraud_reason=p_reason
    where order_id=p_order and status in('paid','qualified');
  return affected;
end$$;

revoke all on function public.redeem_reward_atomic(uuid,text,text) from public,anon,authenticated;
revoke all on function public.expire_reward_credits() from public,anon,authenticated;
revoke all on function public.reverse_rewards_after_refund(uuid,text) from public,anon,authenticated;

commit;
