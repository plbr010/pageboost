import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrgRow } from "@/lib/types";

export async function ensureOrganization(
  supabase: SupabaseClient,
  name = "Minha empresa",
): Promise<{ organizationId: string; organization: OrgRow | null }> {
  const { data: orgId, error } = await supabase.rpc("bootstrap_organization", {
    org_name: name,
  });

  if (error || !orgId) {
    throw new Error(error?.message ?? "Falha ao preparar organização");
  }

  const id = orgId as string;

  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return {
    organizationId: id,
    organization: organization as OrgRow | null,
  };
}
