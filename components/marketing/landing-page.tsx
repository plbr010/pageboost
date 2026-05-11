import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Link2,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { LogoWordmark } from "@/components/brand/logo";

const heroFlow = [
  {
    icon: LayoutGrid,
    title: "Sua página",
    body: "Você divulga um link com formulário profissional.",
  },
  {
    icon: LayoutDashboard,
    title: "Lead no painel",
    body: "Nome, telefone e interesse entram organizados no funil.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    body: "Abre com mensagem pronta para você continuar o atendimento.",
  },
] as const;

const benefits = [
  {
    icon: LayoutGrid,
    title: "Página profissional",
    body: "Landing com a cara do seu negócio para divulgar em anúncios, bio e cartão.",
  },
  {
    icon: Zap,
    title: "Captura por formulário",
    body: "O cliente informa nome, telefone e interesse antes de ir para o WhatsApp.",
  },
  {
    icon: BarChart3,
    title: "Painel de leads",
    body: "Veja quem entrou, de onde veio e em qual etapa está.",
  },
  {
    icon: Layers,
    title: "Kanban simples",
    body: "Arraste o card quando a negociação avança — você controla o funil.",
  },
  {
    icon: Bell,
    title: "Follow-up por tempo",
    body: "Alertas quando o lead fica parado na etapa ou na coluna de follow-up.",
  },
  {
    icon: Sparkles,
    title: "Cadastro manual",
    body: "Indicação de balcão ou Instagram? Cadastre o lead direto no painel.",
  },
  {
    icon: Link2,
    title: "Link público",
    body: "Um endereço único para colocar na bio, anúncio ou enviar no direct.",
  },
];

const steps = [
  { n: "1", title: "Cliente acessa sua página", body: "Link com título e texto que você configura no painel." },
  { n: "2", title: "Preenche nome, telefone e interesse", body: "Formulário claro; observação opcional." },
  { n: "3", title: "Lead entra no painel", body: "O contato aparece na coluna Novo, pronto para atendimento." },
  { n: "4", title: "WhatsApp abre com mensagem pronta", body: "O cliente segue no app com o texto já sugerido." },
  { n: "5", title: "Você acompanha no Kanban", body: "Move o card conforme a conversa evolui." },
  { n: "6", title: "O sistema avisa no follow-up", body: "Quando precisa retomar contato, você vê na central." },
];

const faq = [
  {
    q: "Como os leads entram no painel?",
    a: "Pelo formulário da sua página pública: o visitante preenche os campos e confirma. Nesse momento o lead é gravado no painel e o WhatsApp abre com mensagem sugerida. Você também pode cadastrar leads manualmente.",
  },
  {
    q: "Preciso instalar algo?",
    a: "Não. O painel roda no navegador (computador ou celular). Seu cliente usa o navegador na página pública.",
  },
  {
    q: "O PageBoost lê minhas conversas do WhatsApp?",
    a: "Não. O lead entra pelo formulário da página e o WhatsApp abre com mensagem pronta. Não há leitura automática de conversas.",
  },
  {
    q: "O que é automático e o que é manual?",
    a: "Automático: salvar o lead ao enviar o formulário, abrir o WhatsApp com texto sugerido e calcular alertas de tempo na etapa. Manual: responder no WhatsApp, arrastar o card e marcar fechado ou perdido.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A página pública e o painel são responsivos.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-full overflow-x-hidden bg-[#060814] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(30,27,75,0.28)_0%,transparent_40%,rgba(15,23,42,0.45)_100%)]"
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#060814]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="pb-focus rounded-lg">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
          <nav className="flex items-center gap-3">
            <a
              href="#fluxo"
              className="hidden text-sm font-medium text-slate-400 transition hover:text-white sm:inline"
            >
              Como funciona
            </a>
            <Link
              href="/login"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-indigo-400/40 hover:bg-white/10"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:brightness-105"
            >
              Começar
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" />
              Página pública + painel de leads
            </p>
            <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.65rem]">
              Pare de perder leads do WhatsApp por falta de organização.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              O PageBoost cria uma página profissional para captar interessados e organiza cada lead em um painel
              simples com Kanban, follow-up e controle de atendimento.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/25 transition hover:brightness-105"
              >
                Quero minha página com painel
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#fluxo"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div
              id="fluxo"
              className="relative scroll-mt-28 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950 p-6 shadow-lg shadow-black/25 ring-1 ring-white/5 sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">Em poucos passos</p>
              <p className="mt-2 text-base font-medium text-white">Da divulgação ao atendimento</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                Sua empresa divulga o link → o cliente preenche → o lead entra no painel → o WhatsApp abre com
                mensagem pronta.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                {heroFlow.map((step, i) => (
                  <Fragment key={step.title}>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-1 sm:p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/25">
                        <step.icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">{step.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{step.body}</p>
                    </div>
                    {i < heroFlow.length - 1 && (
                      <>
                        <div className="flex justify-center py-1 sm:hidden" aria-hidden>
                          <ChevronDown className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="hidden shrink-0 items-center px-0.5 sm:flex" aria-hidden>
                          <ChevronRight className="h-5 w-5 text-slate-600" />
                        </div>
                      </>
                    )}
                  </Fragment>
                ))}
              </div>
              <p className="mt-6 border-t border-white/5 pt-5 text-center text-xs text-slate-500">
                No painel: Kanban, central de follow-up e cadastro manual — após criar sua conta.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-slate-950/40 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Benefícios</h2>
            <p className="mt-3 text-slate-400">Tudo o que você precisa para não perder oportunidade.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-indigo-500/35"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Como funciona</h2>
            <p className="mt-3 text-slate-400">Do primeiro clique ao acompanhamento no funil.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-white/10 bg-slate-900/35 p-6 pt-10">
                <span className="absolute left-6 top-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg">
                  {s.n}
                </span>
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-violet-950/50 p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Plano Founder</p>
            <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-4xl font-bold text-white sm:text-5xl">
                  R$297 <span className="text-lg font-semibold text-slate-400">implantação</span>
                </p>
                <p className="mt-2 text-2xl font-semibold text-indigo-200">+ R$97/mês</p>
              </div>
              <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Landing page profissional",
                  "Captação de leads via formulário",
                  "Painel Kanban",
                  "Abertura do WhatsApp com mensagem sugerida",
                  "Central de follow-up por tempo na etapa",
                  "Cadastro manual de leads no painel",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Quero minha página com painel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-slate-950/35 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition open:border-indigo-500/30 open:bg-indigo-500/[0.06]"
              >
                <summary className="cursor-pointer list-none font-medium text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {item.q}
                    <span className="text-indigo-400 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6">
          <LogoWordmark size="sm" variant="onDark" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="transition hover:text-white">
              Entrar
            </Link>
            <a href="#fluxo" className="transition hover:text-white">
              Como funciona
            </a>
            <span>© {new Date().getFullYear()} PageBoost</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
