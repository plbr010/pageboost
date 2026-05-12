import { FounderSalePage } from "@/components/founder/founder-sale-page";
import { getSalesWhatsappUrl } from "@/lib/sales-whatsapp";

type Props = { searchParams?: Promise<{ cancelled?: string }> };

export default async function FounderPage(props: Props) {
  const sp = (await props.searchParams) ?? {};
  const cancelled = sp.cancelled === "1";
  const salesHref = getSalesWhatsappUrl();

  return <FounderSalePage salesWhatsappHref={salesHref} cancelled={cancelled} />;
}
