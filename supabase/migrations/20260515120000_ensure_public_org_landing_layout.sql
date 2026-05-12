-- Garante coluna + constraint e que a RPC pública devolve landing_layout (senão /l/[slug] fica sempre "simple").
-- Idempotente: seguro rodar mesmo se 20260509120000 já tiver sido aplicada.

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

drop function if exists public.get_public_org_by_slug(text);

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
    coalesce(nullif(trim(o.landing_layout), ''), 'simple')::text as landing_layout
  from public.organizations o
  where lower(trim(o.slug)) = lower(trim(p_slug))
    and o.ativo = true
  limit 1;
$$;

grant execute on function public.get_public_org_by_slug(text) to anon, authenticated;
