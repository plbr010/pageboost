import { notFound } from "next/navigation";
import { createPublicAnonClient } from "@/lib/supabase/public-anon";
import { SimpleLanding } from "@/components/public-landing/layouts/SimpleLanding";
import { PremiumLanding } from "@/components/public-landing/layouts/PremiumLanding";
import type { LandingLayout, PublicOrgPayload } from "@/components/public-landing/types";

export const dynamic = "force-dynamic";

function coercePayload(row: unknown): PublicOrgPayload | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const rawLayout = String(r.landing_layout ?? "")
    .trim()
    .toLowerCase();
  const layout: LandingLayout = rawLayout === "premium" ? "premium" : "simple";
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    whatsapp_number: String(r.whatsapp_number ?? ""),
    titulo_landing: String(r.titulo_landing ?? ""),
    descricao_landing: String(r.descricao_landing ?? ""),
    ativo: Boolean(r.ativo),
    landing_layout: layout,
  };
}

export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam ?? "").trim();
  if (!slug) notFound();

  const supabase = createPublicAnonClient();
  const { data, error } = await supabase.rpc("get_public_org_by_slug", { p_slug: slug });

  if (error) notFound();

  const raw = Array.isArray(data) ? data[0] : data;
  const row = coercePayload(raw);
  if (!row || !row.ativo) notFound();

  if (row.landing_layout === "premium") {
    return <PremiumLanding org={row} slug={slug} />;
  }
  return <SimpleLanding org={row} slug={slug} />;
}
