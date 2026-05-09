import type { LeadStatus } from "@/lib/types";

const HOURS_EM_ATENDIMENTO = 48;
const HOURS_ORCAMENTO = 72;

/** Aviso por tempo parado na etapa (usa status_updated_at) */
export function followupBanner(
  status: LeadStatus,
  statusUpdatedAt: string,
): "follow_up_recomendado" | "cobrar_retorno" | null {
  const hours = (Date.now() - new Date(statusUpdatedAt).getTime()) / 3600000;

  if (status === "em_atendimento" && hours >= HOURS_EM_ATENDIMENTO) {
    return "follow_up_recomendado";
  }
  if (status === "orcamento_enviado" && hours >= HOURS_ORCAMENTO) {
    return "cobrar_retorno";
  }
  return null;
}

export function isFollowUpColumn(status: LeadStatus): boolean {
  return status === "follow_up";
}

export function leadNeedsAttention(status: LeadStatus, statusUpdatedAt: string): boolean {
  if (status === "follow_up") return true;
  return followupBanner(status, statusUpdatedAt) !== null;
}

export function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

/** Texto humano para listagem de follow-up */
export function formatParado(iso: string): string {
  const h = hoursSince(iso);
  if (h < 1) return `${Math.max(0, Math.floor(h * 60))} min`;
  if (h < 48) return `${Math.floor(h)} h`;
  const d = Math.floor(h / 24);
  return `${d} dia${d > 1 ? "s" : ""}`;
}

export function attentionLabel(status: LeadStatus, statusUpdatedAt: string): string {
  if (status === "follow_up") return "Coluna Follow-up";
  const b = followupBanner(status, statusUpdatedAt);
  if (b === "follow_up_recomendado") return "Em atendimento · parado 48h+";
  if (b === "cobrar_retorno") return "Orçamento enviado · sem retorno 72h+";
  return "—";
}
