import type { LeadStatus } from "@/lib/types";

export const PIPELINE_STATUSES: LeadStatus[] = [
  "novo",
  "em_atendimento",
  "orcamento_enviado",
  "follow_up",
  "fechado",
  "perdido",
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  orcamento_enviado: "Orçamento enviado",
  follow_up: "Follow-up",
  fechado: "Fechado",
  perdido: "Perdido",
};
