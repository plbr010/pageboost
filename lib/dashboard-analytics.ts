import type { LeadRow, LeadStatus } from "@/lib/types";
import { leadNeedsAttention } from "@/lib/followup";

export type DayCount = { label: string; count: number; iso: string };

/** Últimos `days` dias (incluindo hoje) com contagem de leads criados por dia (timezone local). */
export function leadsCreatedPerDay(leads: Pick<LeadRow, "created_at">[], days = 7): DayCount[] {
  const out: DayCount[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
    const count = leads.filter((l) => l.created_at.slice(0, 10) === iso).length;
    out.push({ iso, label, count });
  }
  return out;
}

export function conversionRatePercent(byStatus: Record<LeadStatus, number>): number {
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return Math.round(((byStatus.fechado ?? 0) / total) * 100);
}

export function filterAttentionLeads(leads: LeadRow[]): LeadRow[] {
  return leads
    .filter((l) => leadNeedsAttention(l.status, l.status_updated_at))
    .sort((a, b) => new Date(a.status_updated_at).getTime() - new Date(b.status_updated_at).getTime());
}
