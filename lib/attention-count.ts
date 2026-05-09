import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadRow } from "@/lib/types";
import { leadNeedsAttention } from "@/lib/followup";

/** Conta leads que entram na central de follow-up (regras de tempo + coluna follow_up). */
export async function fetchAttentionCount(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("leads")
    .select("status, status_updated_at")
    .eq("organization_id", organizationId);

  if (error) throw error;

  const rows = (data ?? []) as Pick<LeadRow, "status" | "status_updated_at">[];
  return rows.filter((r) => leadNeedsAttention(r.status, r.status_updated_at)).length;
}
