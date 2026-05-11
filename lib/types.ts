export type LeadStatus =
  | "novo"
  | "em_atendimento"
  | "orcamento_enviado"
  | "follow_up"
  | "fechado"
  | "perdido";

export type LeadRow = {
  id: string;
  organization_id: string;
  nome: string;
  telefone: string;
  interesse: string;
  observacao: string | null;
  status: LeadStatus;
  origem: string;
  status_updated_at: string;
  created_at: string;
  updated_at: string;
};

export type OrgLandingLayout = "simple" | "premium";

export type OrgRow = {
  id: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  titulo_landing: string;
  descricao_landing: string;
  ativo: boolean;
  landing_layout?: OrgLandingLayout;
  created_at: string;
};
