"use client";

import { useCallback, useState } from "react";

const ERR =
  "Não foi possível abrir o pagamento. Tente novamente ou fale conosco pelo WhatsApp.";

type Props = {
  salesWhatsappHref: string | null;
  /** Mostrar CTA só assinatura */
  showMonthly?: boolean;
  /** Mostrar CTA assinatura + setup */
  showSetup?: boolean;
  monthlyLabel?: string;
  setupLabel?: string;
  /** Na faixa hero, exibir link WhatsApp ao lado dos botões de pagamento */
  showWhatsapp?: boolean;
};

export function FounderCheckoutButtons({
  salesWhatsappHref,
  showMonthly = true,
  showSetup = true,
  monthlyLabel = "Começar por R$97/mês",
  setupLabel = "Começar com ativação assistida",
  showWhatsapp = true,
}: Props) {
  const [loading, setLoading] = useState<null | "monthly" | "setup">(null);

  const start = useCallback(async (withSetup: boolean) => {
    setLoading(withSetup ? "setup" : "monthly");
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withSetup }),
      });
      const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!r.ok || !data.url) throw new Error(data.error || ERR);
      window.location.href = data.url;
    } catch {
      alert(ERR);
      setLoading(null);
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {showMonthly ? (
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void start(false)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "monthly" ? "Abrindo pagamento…" : monthlyLabel}
        </button>
      ) : null}
      {showSetup ? (
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void start(true)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "setup" ? "Abrindo pagamento…" : setupLabel}
        </button>
      ) : null}
      {showWhatsapp && salesWhatsappHref ? (
        <a
          href={salesWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/5"
        >
          Falar no WhatsApp
        </a>
      ) : null}
    </div>
  );
}
