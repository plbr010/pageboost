/**
 * TEMPORARY AUDIT ROUTE — `/demo-dashboard`
 * Builder only; no network. Remove with the demo route after audit.
 */
import type { LeadRow, LeadStatus } from "@/lib/types";

export const DEMO_AUDIT_ROUTE = "/demo-dashboard";

export const DEMO_ORG_ID = "00000000-0000-4000-8000-000000000000";

export const DEMO_ORG_SETTINGS = {
  name: "Studio Aurora (demonstração)",
  whatsapp: "5511987654321",
  titulo_landing: "Orçamento rápido — sites e tráfego",
  descricao_landing: "Preencha o formulário e fale com a equipe pelo WhatsApp em minutos.",
  slug: "studio-aurora-demo",
  ativo: true,
} as const;

function h(hours: number): string {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

function row(
  id: string,
  p: {
    nome: string;
    telefone: string;
    interesse: string;
    observacao: string | null;
    status: LeadStatus;
    origem: string;
    createdHoursAgo: number;
    statusUpdatedHoursAgo: number;
    updatedHoursAgo?: number;
  },
): LeadRow {
  return {
    id,
    organization_id: DEMO_ORG_ID,
    nome: p.nome,
    telefone: p.telefone,
    interesse: p.interesse,
    observacao: p.observacao,
    status: p.status,
    origem: p.origem,
    created_at: h(p.createdHoursAgo),
    updated_at: h(p.updatedHoursAgo ?? p.createdHoursAgo),
    status_updated_at: h(p.statusUpdatedHoursAgo),
  };
}

export function buildInitialDemoLeads(): LeadRow[] {
  return [
    row("demo-lead-01", {
      nome: "Marina Duarte",
      telefone: "+55 11 98877-1101",
      interesse: "Landing + Google Ads",
      observacao: "Prefere contato à tarde.",
      status: "novo",
      origem: "landing_page",
      createdHoursAgo: 6,
      statusUpdatedHoursAgo: 6,
    }),
    row("demo-lead-02", {
      nome: "Ricardo Mota",
      telefone: "11988776655",
      interesse: "CRM simples para equipe comercial",
      observacao: null,
      status: "novo",
      origem: "manual",
      createdHoursAgo: 30,
      statusUpdatedHoursAgo: 30,
    }),
    row("demo-lead-03", {
      nome: "Ana Beatriz Nogueira",
      telefone: "+55 21 97766-3322",
      interesse: "Redesign do site institucional",
      observacao: null,
      status: "em_atendimento",
      origem: "landing_page",
      createdHoursAgo: 120,
      statusUpdatedHoursAgo: 52,
    }),
    row("demo-lead-04", {
      nome: "Felipe Costa",
      telefone: "47999112233",
      interesse: "Integração WhatsApp + formulário",
      observacao: "Time de 3 pessoas.",
      status: "em_atendimento",
      origem: "manual",
      createdHoursAgo: 48,
      statusUpdatedHoursAgo: 8,
    }),
    row("demo-lead-05", {
      nome: "Letícia Prado",
      telefone: "+55 31 96655-8899",
      interesse: "Proposta pacote Growth",
      observacao: null,
      status: "orcamento_enviado",
      origem: "landing_page",
      createdHoursAgo: 200,
      statusUpdatedHoursAgo: 80,
    }),
    row("demo-lead-06", {
      nome: "Gustavo Henrique",
      telefone: "85988774411",
      interesse: "Consultoria de funil",
      observacao: null,
      status: "orcamento_enviado",
      origem: "manual",
      createdHoursAgo: 90,
      statusUpdatedHoursAgo: 20,
    }),
    row("demo-lead-07", {
      nome: "Camila Rocha",
      telefone: "+55 11 94567-8890",
      interesse: "Follow-up campanha Meta",
      observacao: "Cliente antigo.",
      status: "follow_up",
      origem: "manual",
      createdHoursAgo: 400,
      statusUpdatedHoursAgo: 96,
    }),
    row("demo-lead-08", {
      nome: "Pedro Afonso",
      telefone: "61987654321",
      interesse: "Contrato anual fechado",
      observacao: null,
      status: "fechado",
      origem: "landing_page",
      createdHoursAgo: 500,
      statusUpdatedHoursAgo: 12,
      updatedHoursAgo: 12,
    }),
    row("demo-lead-09", {
      nome: "Juliana Freitas",
      telefone: "+55 48 99123-4455",
      interesse: "Pacote site + SEO local",
      observacao: null,
      status: "fechado",
      origem: "manual",
      createdHoursAgo: 600,
      statusUpdatedHoursAgo: 60,
      updatedHoursAgo: 60,
    }),
    row("demo-lead-10", {
      nome: "Bruno Teixeira",
      telefone: "11933445566",
      interesse: "Sem budget neste trimestre",
      observacao: "Pediu pausa.",
      status: "perdido",
      origem: "landing_page",
      createdHoursAgo: 300,
      statusUpdatedHoursAgo: 240,
    }),
    row("demo-lead-11", {
      nome: "Lúcia Mendes",
      telefone: "+55 85 97788-6655",
      interesse: "Reativação — novo orçamento",
      observacao: null,
      status: "follow_up",
      origem: "manual",
      createdHoursAgo: 150,
      statusUpdatedHoursAgo: 10,
    }),
    row("demo-lead-12", {
      nome: "Diego Araújo",
      telefone: "21988776600",
      interesse: "Automação de follow-up",
      observacao: null,
      status: "novo",
      origem: "landing_page",
      createdHoursAgo: 2,
      statusUpdatedHoursAgo: 2,
    }),
  ];
}

export const DEMO_PIPELINE_ORDER: LeadStatus[] = [
  "novo",
  "em_atendimento",
  "orcamento_enviado",
  "follow_up",
  "fechado",
  "perdido",
];
