/** Colunas usadas em listagens de leads — evita `select("*")` em telas quentes. */
export const LEAD_LIST_COLUMNS =
  "id, organization_id, nome, telefone, interesse, observacao, status, origem, status_updated_at, created_at, updated_at" as const;
