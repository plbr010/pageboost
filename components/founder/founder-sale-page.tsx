"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { LogoWordmark } from "@/components/brand/logo";
import { Check } from "lucide-react";

const USER_ERR =
  "Não foi possível abrir o pagamento. Verifique as configurações da Stripe ou tente novamente.";

const BENEFITS = [
  "Página pública profissional para divulgar seu negócio",
  "Escolha de layout da página",
  "Formulário de captação de leads",
  "Lead salvo automaticamente no painel",
  "WhatsApp abre com mensagem pronta",
  "Kanban para acompanhar cada atendimento",
  "Alertas de follow-up",
  "Cadastro manual de leads",
  "Dashboard com métricas simples",
  "Link público para bio, anúncio ou enviar para clientes",
] as const;

type Props = {
  salesWhatsappHref: string | null;
  cancelled: boolean;
};

export function FounderSalePage({ salesWhatsappHref, cancelled }: Props) {
  const [loading, setLoading] = useState<null | "monthly" | "setup">(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (withSetup: boolean) => {
    setError(null);
    setLoading(withSetup ? "setup" : "monthly");
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withSetup }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        missingEnv?: string[];
      };
      if (!r.ok || !data.url) {
        if (process.env.NODE_ENV === "development" && data.missingEnv?.length) {
          console.warn("[founder] Stripe env ausente:", data.missingEnv);
        }
        throw new Error(data.error || USER_ERR);
      }
      window.location.href = data.url;
    } catch {
      setError(USER_ERR);
      setLoading(null);
    }
  }, []);

  const busy = loading !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="pb-focus rounded-lg">
            <LogoWordmark size="sm" variant="onLight" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {cancelled ? (
          <p
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
            role="status"
          >
            Pagamento cancelado. Você pode tentar novamente quando quiser.
          </p>
        ) : null}

        {error ? (
          <div
            className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50/80 p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">Plano Founder</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
            Pare de perder leads do WhatsApp por falta de organização.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            O PageBoost cria uma página profissional para captar interessados e organiza cada lead em um
            painel simples com Kanban, follow-up e controle de atendimento.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--pb-shadow-card)]">
          <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Founder</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">R$97</span>
              <span className="text-lg font-medium text-slate-500">/mês</span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Primeiras vagas com preço especial para negócios que recebem contatos pelo WhatsApp e querem
              organizar cada oportunidade sem planilha, bagunça ou esquecimento.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <ul className="grid gap-2.5 text-sm text-slate-700 sm:grid-cols-2">
              {BENEFITS.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="leading-snug">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                disabled={busy}
                onClick={() => void start(false)}
                className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-900/15 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-90"
              >
                {loading === "monthly" ? "Abrindo pagamento…" : "Assinar por R$97/mês"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void start(true)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-indigo-200 bg-white px-6 py-3 text-sm font-bold text-indigo-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/80 disabled:cursor-wait disabled:opacity-90"
              >
                {loading === "setup" ? "Abrindo pagamento…" : "Assinar com ativação assistida"}
              </button>
              {salesWhatsappHref ? (
                <a
                  href={salesWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Falar no WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Quer que a gente configure tudo para você?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Por <strong className="text-slate-900">R$197</strong> uma vez, ajudamos a configurar sua página
            pública, WhatsApp, layout, título, descrição e mostramos como usar o painel.
          </p>
          <p className="mt-3 inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100">
            Ativação assistida é opcional.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={busy}
              onClick={() => void start(true)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-90"
            >
              {loading === "setup" ? "Abrindo pagamento…" : "Assinar com ativação assistida"}
            </button>
            {salesWhatsappHref ? (
              <a
                href={salesWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Tirar dúvidas no WhatsApp
              </a>
            ) : null}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-slate-500">
          Sem taxa obrigatória de implantação. Pagamento seguro via Stripe.
        </p>
      </main>
    </div>
  );
}
