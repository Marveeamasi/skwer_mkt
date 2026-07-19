begin;
create table public.email_verification_otps(id uuid primary key default gen_random_uuid(),email text not null,code_hash text not null,purpose text not null default 'seller_signup',attempts integer not null default 0,expires_at timestamptz not null,consumed_at timestamptz,created_at timestamptz not null default now());
create index otp_email_lookup on public.email_verification_otps(email,purpose,created_at desc);
alter table public.email_verification_otps enable row level security;
revoke all on public.email_verification_otps from anon,authenticated;
commit;
