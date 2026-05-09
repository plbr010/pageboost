-- PageBoost MVP simplificado (instalação nova no Supabase)
-- Auth: Email habilitado

create extension if not exists "pgcrypto";

do $$ begin
  create type public.lead_status as enum (
    'novo',
    'em_atendimento',
    'orcamento_enviado',
    'follow_up',
    'fechado',
    'perdido'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Minha empresa',
  slug text not null unique,
  whatsapp_number text not null default '',
  titulo_landing text not null default 'Fale conosco pelo WhatsApp',
  descricao_landing text not null default 'Preencha seus dados e iniciamos seu atendimento em instantes.',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner',
  primary key (organization_id, user_id)
);

create index if not exists idx_org_members_user on public.organization_members (user_id);
create index if not exists idx_org_slug on public.organizations (slug);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  nome text not null,
  telefone text not null,
  interesse text not null,
  observacao text,
  status public.lead_status not null default 'novo',
  origem text not null default 'manual',
  status_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_org_status on public.leads (organization_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated
  before update on public.leads
  for each row execute function public.set_updated_at();

create or replace function public.bump_lead_status_updated_at()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.status_updated_at := now();
    return new;
  end if;
  if old.status is distinct from new.status then
    new.status_updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_leads_status_clock on public.leads;
create trigger trg_leads_status_clock
  before insert or update on public.leads
  for each row execute function public.bump_lead_status_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.bootstrap_organization(org_name text default 'Minha empresa')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  oid uuid;
  base_slug text;
  final_slug text;
  n int := 0;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select organization_id into oid
  from public.organization_members
  where user_id = auth.uid()
  limit 1;

  if oid is not null then
    return oid;
  end if;

  base_slug := lower(regexp_replace(coalesce(nullif(trim(org_name), ''), 'empresa'), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' or base_slug is null then
    base_slug := 'empresa';
  end if;

  final_slug := base_slug;
  while exists (select 1 from public.organizations o where o.slug = final_slug) loop
    n := n + 1;
    final_slug := base_slug || '-' || n::text;
  end loop;

  insert into public.organizations (name, slug, whatsapp_number, titulo_landing, descricao_landing, ativo)
  values (
    coalesce(nullif(trim(org_name), ''), 'Minha empresa'),
    final_slug,
    '',
    'Fale conosco pelo WhatsApp',
    'Preencha seus dados e iniciamos seu atendimento em instantes.',
    true
  )
  returning id into oid;

  insert into public.organization_members (organization_id, user_id, role)
  values (oid, auth.uid(), 'owner');

  return oid;
end;
$$;

grant execute on function public.bootstrap_organization(text) to authenticated;

create or replace function public.reset_lead_status_clock(lead_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.leads l
  set status_updated_at = now()
  from public.organization_members m
  where l.id = lead_id
    and m.organization_id = l.organization_id
    and m.user_id = auth.uid();
end;
$$;

grant execute on function public.reset_lead_status_clock(uuid) to authenticated;

create or replace function public.get_public_org_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  slug text,
  whatsapp_number text,
  titulo_landing text,
  descricao_landing text,
  ativo boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select o.id, o.name, o.slug, o.whatsapp_number, o.titulo_landing, o.descricao_landing, o.ativo
  from public.organizations o
  where o.slug = p_slug
    and o.ativo = true
  limit 1;
$$;

grant execute on function public.get_public_org_by_slug(text) to anon, authenticated;

create or replace function public.public_submit_lead(
  p_slug text,
  p_nome text,
  p_telefone text,
  p_interesse text,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  oid uuid;
  lid uuid;
begin
  select o.id into oid
  from public.organizations o
  where o.slug = p_slug and o.ativo = true
  limit 1;

  if oid is null then
    raise exception 'invalid_slug';
  end if;

  if coalesce(trim(p_nome), '') = '' or coalesce(trim(p_telefone), '') = '' or coalesce(trim(p_interesse), '') = '' then
    raise exception 'validation_error';
  end if;

  insert into public.leads (
    organization_id,
    nome,
    telefone,
    interesse,
    observacao,
    status,
    origem
  )
  values (
    oid,
    trim(p_nome),
    trim(p_telefone),
    trim(p_interesse),
    nullif(trim(p_observacao), ''),
    'novo',
    'landing_page'
  )
  returning id into lid;

  return lid;
end;
$$;

grant execute on function public.public_submit_lead(text, text, text, text, text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.leads enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "org_members_select" on public.organization_members;
create policy "org_members_select"
  on public.organization_members for select
  using (auth.uid() = user_id);

drop policy if exists "organizations_select" on public.organizations;
create policy "organizations_select"
  on public.organizations for select
  using (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = organizations.id and m.user_id = auth.uid()
    )
  );

drop policy if exists "organizations_update_owner" on public.organizations;
create policy "organizations_update_owner"
  on public.organizations for update
  using (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = organizations.id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "leads_all_member" on public.leads;
create policy "leads_all_member"
  on public.leads for all
  using (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = leads.organization_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = leads.organization_id and m.user_id = auth.uid()
    )
  );
