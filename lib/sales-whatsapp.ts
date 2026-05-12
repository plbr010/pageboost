import { buildWhatsappUrl } from "@/lib/whatsapp";

const DEFAULT_MSG = "Olá, quero assinar o PageBoost Founder.";

/** URL do WhatsApp comercial, se `NEXT_PUBLIC_SALES_WHATSAPP` estiver definido. */
export function getSalesWhatsappUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SALES_WHATSAPP?.trim();
  if (!raw) return null;
  return buildWhatsappUrl(raw, DEFAULT_MSG);
}
