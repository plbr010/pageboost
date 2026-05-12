-- Slug inicial mais limpo quando o nome da org é uma URL / host (evita https-pageboosteur-vercel-app).
-- Reforça get_public_org_by_slug com landing_layout para instalações onde a migração anterior não rodou.

create or replace function public.bootstrap_organization(org_name text default 'Minha empresa')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  oid uuid;
  cleaned text;
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

  cleaned := coalesce(nullif(trim(org_name), ''), 'empresa');
  cleaned := regexp_replace(cleaned, '^https?://', '', 'gi');
  cleaned := regexp_replace(cleaned, '^www\.', '', 'gi');
  -- Hostname típico (sem espaços): usa só o primeiro rótulo (ex.: pageboosteur.vercel.app → pageboosteur)
  if cleaned !~ '\s' and cleaned ~ '^[a-zA-Z0-9.-]+\.[a-zA-Z]' then
    cleaned := split_part(
      lower(regexp_replace(cleaned, '/.*$', '')),
      '.',
      1
    );
  end if;

  base_slug := lower(regexp_replace(cleaned, '[^a-zA-Z0-9]+', '-', 'g'));
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
    o.landing_layout
  from public.organizations o
  where o.slug = p_slug
    and o.ativo = true
  limit 1;
$$;

grant execute on function public.get_public_org_by_slug(text) to anon, authenticated;
