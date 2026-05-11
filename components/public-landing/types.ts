export type LandingLayout = "simple" | "premium";

export type PublicOrgPayload = {
  id: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  titulo_landing: string;
  descricao_landing: string;
  ativo: boolean;
  landing_layout: LandingLayout;
};
