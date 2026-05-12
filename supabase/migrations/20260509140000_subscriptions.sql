-- Registro de assinaturas Stripe (webhook). Service role bypassa RLS.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'incomplete',
  plan text not null default 'founder',
  with_setup boolean not null default false,
  setup_paid boolean not null default false,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

create index if not exists subscriptions_email_idx
  on public.subscriptions (email);

alter table public.subscriptions enable row level security;

-- Nenhuma policy: anon/authenticated não leem; service role grava via API.
