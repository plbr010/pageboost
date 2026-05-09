/** Dígitos apenas; adiciona 55 se parecer celular BR sem DDI */
export function normalizeWhatsappDigits(input: string): string {
  const d = input.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("55") && d.length >= 12) return d;
  if (d.length >= 10 && d.length <= 11) return `55${d}`;
  return d;
}

export function buildWhatsappUrl(phoneDigits: string, message: string): string {
  const n = normalizeWhatsappDigits(phoneDigits);
  const text = encodeURIComponent(message);
  return `https://wa.me/${n}?text=${text}`;
}
