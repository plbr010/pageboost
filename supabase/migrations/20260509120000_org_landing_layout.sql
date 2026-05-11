-- Layout da landing pública + compatibilidade com funções existentes

alter table public.organizations
  add column if not exists landing_layout text not null default 'simple';

update public.organizations
set landing_layout = 'simple'
where landing_layout is null or landing_layout = '';

alter table public.organizations
  drop constraint if exists organizations_landing_layout_check;

alter table public.organizations
  add constraint organizations_landing_layout_check
  check (landing_layout in ('simple', 'premium'));

create or replace function public.get_public_org_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  slug text,
  whatsapp_number text,
  titulo_landing text,
  descricao_landing text,
  ativo boolean,
  landing_layout text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    o.id,
    o.name,
    o.slug,
    o.whatsapp_number,
    o.titulo_landing,
    o.descricao_landing,
    o.ativo,
    o.landing_layout
  from public.organizations o
  where o.slug = p_slug
    and o.ativo = true
  limit 1;
$$;

grant execute on function public.get_public_org_by_slug(text) to anon, authenticated;

-- Garante timestamps explícitos no lead vindo da página pública
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
  ts timestamptz := now();
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
    origem,
    created_at,
    updated_at,
    status_updated_at
  )
  values (
    oid,
    trim(p_nome),
    trim(p_telefone),
    trim(p_interesse),
    nullif(trim(p_observacao), ''),
    'novo',
    'landing_page',
    ts,
    ts,
    ts
  )
  returning id into lid;

  return lid;
end;
$$;

grant execute on function public.public_submit_lead(text, text, text, text, text) to anon, authenticated;
