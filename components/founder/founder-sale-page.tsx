"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { LogoWordmark } from "@/components/brand/logo";
import {
  Check,
  ChevronDown,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

const USER_ERR =
  "Não foi possível abrir o pagamento. Verifique as configurações da Stripe ou fale conosco.";

const PLAN_BENEFITS = [
  "Página pública profissional",
  "Escolha de layout da página",
  "Formulário de captação de leads",
  "Lead salvo no painel",
  "WhatsApp com mensagem pronta",
  "Kanban de atendimento",
  "Alertas de follow-up",
  "Cadastro manual de leads",
  "Dashboard com métricas simples",
] as const;

const STEPS = [
  "Você assina",
  "Cria sua conta",
  "Configura sua página pública",
  "Divulga o link",
  "Os leads entram no painel",
  "Você acompanha no Kanban e faz follow-up",
] as const;

const AUDIENCES = [
  { title: "Clínicas e estética", body: "Orçamentos e retornos sem bagunça no WhatsApp." },
  { title: "Oficinas e serviços locais", body: "Pedidos e pedidos de orçamento organizados em um fluxo." },
  { title: "Móveis planejados", body: "Interesse, medidas e próximos passos visíveis no painel." },
  { title: "Cursos e consultorias", body: "Captação pela página e acompanhamento até fechar." },
  { title: "Orçamento pelo WhatsApp", body: "Feito para quem vive de conversa e precisa de método." },
] as const;

const INCLUDED = [
  "Página para divulgar",
  "Painel de leads",
  "Kanban",
  "Follow-up",
  "Métricas",
  "Link público",
  "Suporte inicial",
] as const;

const FAQ = [
  {
    q: "Preciso instalar algo?",
    a: "Não. Você acessa o painel pelo navegador no computador ou celular.",
  },
  {
    q: "O PageBoost lê meu WhatsApp?",
    a: "Não. O lead entra pelo formulário da sua página e o WhatsApp abre com mensagem sugerida. Não há leitura de conversas.",
  },
  {
    q: "Posso cancelar?",
    a: "Sim. A assinatura pode ser cancelada quando fizer sentido para você — sem multa de fidelidade descrita aqui.",
  },
  {
    q: "Consigo usar no celular?",
    a: "Sim. A página pública e o painel são responsivos.",
  },
  {
    q: "O que acontece depois que eu assino?",
    a: "Você cria sua conta, configura título, descrição, WhatsApp e layout, e já pode divulgar o link.",
  },
  {
    q: "A ativação assistida é obrigatória?",
    a: "Não. É opcional. Você pode assinar só o plano mensal e configurar tudo sozinho.",
  },
] as const;

type Props = {
  salesWhatsappHref: string | null;
  cancelled: boolean;
};

function TrustStrip() {
  const items = [
    "Primeiras vagas Founder",
    "Sem fidelidade",
    "Cancele quando quiser",
    "Pagamento seguro via Stripe",
    "Acesso pelo navegador",
    "Feito para quem atende pelo WhatsApp",
  ] as const;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-y border-white/10 bg-white/[0.03] px-4 py-4 sm:gap-x-6">
      {items.map((t) => (
        <span key={t} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400/90" aria-hidden />
          {t}
        </span>
      ))}
    </div>
  );
}

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
        console.error("[founder/checkout]", r.status, data);
        if (data.missingEnv?.length) {
          console.error("[founder/checkout] Variáveis ausentes:", data.missingEnv.join(", "));
        }
        throw new Error(data.error || USER_ERR);
      }
      window.location.href = data.url;
    } catch (e) {
      console.error("[founder/checkout]", e);
      setError(USER_ERR);
      setLoading(null);
    }
  }, []);

  const busy = loading !== null;

  const btnPrimary =
    "inline-flex min-h-[52px] items-center justify-center rounded-xl bg-indigo-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-85";
  const btnSecondary =
    "inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-85";
  const btnOutlineLight =
    "inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-wait disabled:opacity-85";

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-200">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
        aria-hidden
        style={{
          background:
            "radial-gradient(90% 55% at 50% -8%, rgba(79,70,229,0.22) 0%, transparent 52%), radial-gradient(70% 40% at 100% 0%, rgba(91,33,182,0.12) 0%, transparent 45%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070a12]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="pb-focus rounded-lg">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#plano"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-white/5 hover:text-white"
            >
              Começar agora
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
          {cancelled ? (
            <p
              className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100"
              role="status"
            >
              Pagamento cancelado. Você pode tentar novamente quando quiser.
            </p>
          ) : null}

          {error ? (
            <div
              className="mb-8 rounded-xl border border-red-500/35 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-100"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {/* Hero */}
          <section className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Plano Founder
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.65rem]">
              Pare de perder clientes que chamam no WhatsApp.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              O PageBoost cria uma página profissional para captar interessados e organiza cada lead em um painel
              simples com Kanban, follow-up e controle de atendimento.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" disabled={busy} onClick={() => void start(false)} className={btnPrimary}>
                {loading === "monthly" ? "Abrindo pagamento…" : "Assinar por R$97/mês"}
              </button>
              <a href="#incluso" className={btnSecondary}>
                Ver o que está incluso
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Sem taxa obrigatória de implantação. Cancele quando quiser.
            </p>
          </section>

          <TrustStrip />

          {/* Plano principal */}
          <section id="plano" className="mt-16 scroll-mt-28">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/98 shadow-2xl shadow-black/40 ring-1 ring-white/5">
              <div className="border-b border-white/10 bg-white/[0.04] px-6 py-8 sm:px-10 sm:py-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">Plano Founder</h2>
                    <div className="mt-4 flex flex-wrap items-baseline gap-2">
                      <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">R$97</span>
                      <span className="text-xl font-medium text-slate-400">/mês</span>
                    </div>
                    <p className="mt-3 inline-flex rounded-lg bg-indigo-500/15 px-3 py-1.5 text-sm font-semibold text-indigo-100 ring-1 ring-indigo-400/25">
                      Primeiras vagas com preço especial
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-sm text-slate-400">
                    <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-400/90" aria-hidden />
                    <span>
                      Cobrança segura via <strong className="text-slate-200">Stripe</strong>. Você assina e segue
                      para criar sua conta.
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8 sm:px-10 sm:py-10">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {PLAN_BENEFITS.map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-snug text-slate-200">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button type="button" disabled={busy} onClick={() => void start(false)} className={btnPrimary}>
                    {loading === "monthly" ? "Abrindo pagamento…" : "Assinar por R$97/mês"}
                  </button>
                  {salesWhatsappHref ? (
                    <a href={salesWhatsappHref} target="_blank" rel="noopener noreferrer" className={btnOutlineLight}>
                      Falar conosco
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* Ativação assistida */}
          <section className="mt-10">
            <div className="rounded-2xl border border-violet-500/25 bg-violet-950/20 p-6 shadow-lg ring-1 ring-violet-500/10 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">Ativação assistida</h2>
                  <p className="mt-2 text-2xl font-bold text-violet-200 sm:text-3xl">+ R$197 uma vez</p>
                </div>
                <p className="max-w-sm rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-200">
                  Ativação assistida é opcional.
                </p>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Quer que a gente configure tudo para você? Ajudamos com título, descrição, WhatsApp, layout da página e
                primeiros passos no painel.
              </p>
              <button type="button" disabled={busy} onClick={() => void start(true)} className={cn(btnPrimary, "mt-8")}>
                {loading === "setup" ? "Abrindo pagamento…" : "Assinar com ativação assistida"}
              </button>
            </div>
          </section>

          {/* Como funciona */}
          <section className="mt-20">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Como funciona</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
              Do pagamento ao primeiro lead organizado.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  className="relative rounded-xl border border-white/10 bg-slate-900/50 p-5 pt-8 ring-1 ring-white/5"
                >
                  <span className="absolute left-5 top-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-md">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-slate-100">{label}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Para quem é */}
          <section className="mt-20">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Para quem é</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
              Negócios que recebem pedido de orçamento e contato pelo WhatsApp.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-indigo-500/30 hover:bg-slate-900/70"
                >
                  <LayoutGrid className="h-5 w-5 text-indigo-400" aria-hidden />
                  <p className="mt-3 font-bold text-white">{c.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* O que está incluso */}
          <section id="incluso" className="mt-20 scroll-mt-28">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">O que está incluso</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
              Tudo o que você precisa para captar e acompanhar leads sem planilha.
            </p>
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
              <ul className="space-y-3">
                {INCLUDED.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-slate-200">
                    <Zap className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* O que não é */}
          <section className="mt-16 rounded-2xl border border-slate-700/80 bg-slate-900/30 px-6 py-6 sm:px-8 sm:py-7">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Transparência</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              O PageBoost <strong className="font-semibold text-slate-300">não lê conversas</strong> do WhatsApp e{" "}
              <strong className="font-semibold text-slate-300">não envia mensagens automáticas</strong> sozinho. Ele
              organiza os leads captados pela sua página e ajuda você a não esquecer retornos.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-20">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Perguntas frequentes</h2>
            <div className="mx-auto mt-10 max-w-2xl space-y-2">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 open:border-indigo-500/35 open:bg-indigo-950/20"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-left text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-3 border-t border-white/5 pt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <section className="mt-20 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-violet-950/50 p-8 text-center shadow-xl ring-1 ring-white/10 sm:p-12">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Comece hoje a organizar seus leads do WhatsApp.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
              Página profissional + painel. Sem prometer o que não fazemos.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void start(false)}
              className={cn(btnPrimary, "mt-8")}
            >
              {loading === "monthly" ? "Abrindo pagamento…" : "Assinar por R$97/mês"}
            </button>
          </section>

          <p className="mt-12 text-center text-xs text-slate-600">
            Dúvidas sobre cobrança? O checkout é processado pela Stripe.
          </p>
        </div>
      </main>
    </div>
  );
}
