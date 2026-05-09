import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicLanding, type PublicOrgPayload } from "@/components/landing/public-landing";

export const dynamic = "force-dynamic";

export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_org_by_slug", { p_slug: slug });

  if (error) notFound();

  const row = Array.isArray(data) ? (data[0] as PublicOrgPayload | undefined) : (data as PublicOrgPayload | null);
  if (!row || !row.ativo) notFound();

  return <PublicLanding org={row} slug={slug} />;
}
