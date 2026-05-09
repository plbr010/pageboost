import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadRow, LeadStatus } from "@/lib/types";
import { PIPELINE_STATUSES } from "@/lib/status";
import { leadNeedsAttention } from "@/lib/followup";

export type DashboardStats = {
  total: number;
  byStatus: Record<LeadStatus, number>;
  attentionCount: number;
};

type RowForStats = Pick<LeadRow, "status" | "status_updated_at">;

export function aggregateLeadStats(rows: RowForStats[]): DashboardStats {
  const byStatus = PIPELINE_STATUSES.reduce(
    (acc, s) => {
      acc[s] = 0;
      return acc;
    },
    {} as Record<LeadStatus, number>,
  );

  let attentionCount = 0;
  for (const r of rows) {
    byStatus[r.status] += 1;
    if (leadNeedsAttention(r.status, r.status_updated_at)) attentionCount += 1;
  }

  return { total: rows.length, byStatus, attentionCount };
}

export async function fetchDashboardStats(
  supabase: SupabaseClient,
  organizationId: string,
): Promise<DashboardStats> {
  const { data, error } = await supabase
    .from("leads")
    .select("status, status_updated_at")
    .eq("organization_id", organizationId);

  if (error) throw error;

  return aggregateLeadStats((data ?? []) as RowForStats[]);
}
