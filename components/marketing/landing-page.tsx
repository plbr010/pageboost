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
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { LogoWordmark } from "@/components/brand/logo";

const heroFlow = [
  {
    icon: LayoutGrid,
    title: "Formulário",
    body: "Visitante preenche e envia na sua página pública.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel",
    body: "Lead gravado na coluna Novo antes do WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    body: "Conversa continua no app, com texto sugerido.",
  },
] as const;

const benefits = [
  {
    icon: LayoutGrid,
    title: "Página profissional + painel",
    body: "Uma landing pública com a cara do seu negócio e um painel para organizar quem entrou em contato.",
  },
  {
    icon: Zap,
    title: "Captação via formulário",
    body: "O visitante preenche nome, telefone e interesse. Ao enviar, o lead é salvo no painel antes de abrir o WhatsApp.",
  },
  {
    icon: BarChart3,
    title: "Kanban para o funil",
    body: "Colunas claras (novo, atendimento, orçamento…). Você arrasta o card quando a negociação avança — nada automático pelo WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp com mensagem pronta",
    body: "Depois do envio do formulário, abrimos o WhatsApp com texto pré-preenchido. Não há leitura de conversas nem API oficial.",
  },
  {
    icon: Bell,
    title: "Central de follow-up",
    body: "Lista e avisos quando um lead fica parado na etapa (48h / 72h) ou quando você coloca na coluna Follow-up.",
  },
  {
    icon: Sparkles,
    title: "Cadastro manual no painel",
    body: "Indicação de balcão ou Instagram? Cadastre o lead direto no sistema com origem e etapa iniciais.",
  },
];

const steps = [
  { n: "1", title: "Cliente abre sua página pública", body: "Link com nome, título e descrição da empresa — você configura no painel." },
  { n: "2", title: "Preenche o formulário", body: "Nome, telefone e interesse (e observação, se quiser). Nada é salvo antes do envio." },
  { n: "3", title: "Clica em “Chamar no WhatsApp”", body: "Esse clique envia o formulário: primeiro gravamos o lead no banco." },
  { n: "4", title: "Lead salvo no painel", body: "O contato aparece na coluna Novo, com origem “página pública”." },
  { n: "5", title: "Abre o WhatsApp", body: "Em seguida abrimos o app com mensagem pré-preenchida para você continuar o atendimento." },
  { n: "6", title: "Você move no Kanban", body: "Mudanças de etapa são manuais. Alertas de follow-up usam o tempo parado na coluna." },
];

const faq = [
  {
    q: "Como os leads entram no painel?",
    a: "Pelo formulário da sua página pública: o visitante preenche os campos e clica em “Chamar no WhatsApp”. Nesse momento o sistema grava o lead e só então abre o WhatsApp. Você também pode cadastrar leads manualmente no painel.",
  },
  {
    q: "Preciso instalar algo?",
    a: "Não. O painel roda no navegador (computador ou celular). Seu cliente usa o navegador na landing; para falar com você, o WhatsApp no aparelho dele.",
  },
  {
    q: "O que é automático e o que é manual?",
    a: "Automático: salvar o lead ao enviar o formulário, abrir o WhatsApp com mensagem pronta, mostrar o card na coluna Novo e calcular alertas de tempo na etapa. Manual: responder no WhatsApp, arrastar o card no Kanban e marcar fechado/perdido.",
  },
  {
    q: "Como funciona o fluxo com o WhatsApp?",
    a: "Não integramos com a API oficial do WhatsApp. Não lemos conversas. O fluxo é: formulário enviado → lead no painel → link wa.me com texto sugerido. O resto é conversa normal entre você e o cliente.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A landing e o painel são responsivos.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-full overflow-x-hidden bg-[#050814] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(30,27,75,0.35)_0%,transparent_35%,rgba(15,23,42,0.4)_100%)]"
        aria-hidden
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050814]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="pb-focus rounded-lg">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
          <nav className="flex items-center gap-3">
            <a
              href="#demo"
              className="hidden text-sm font-medium text-slate-400 transition hover:text-white sm:inline"
            >
              Fluxo
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

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" />
              Página pública + painel de leads
            </p>
            <h1 className="mt-6 text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
              Lead salvo no painel antes de abrir o WhatsApp — e um Kanban para acompanhar cada negociação.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              Formulário na sua landing, registro automático no painel na coluna Novo, mensagem sugerida no WhatsApp e
              alertas quando o lead esfria na etapa. Sem API oficial, sem promessa de “captura invisível”.
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
                href="#demo"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Ver fluxo resumido
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Sem ERP pesado. Sem IA de atendimento. Sem integração automática com API do WhatsApp — fluxo honesto e
              repetível.
            </p>
          </div>

          <div className="relative lg:pl-4">
            <div
              id="demo"
              className="relative scroll-mt-28 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-lg shadow-black/30 ring-1 ring-white/5 sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">Fluxo em 3 passos</p>
              <p className="mt-2 text-base font-medium text-white">O que acontece na prática</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                Sem mock de números: é o caminho real do lead, do site ao seu atendimento.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                {heroFlow.map((step, i) => (
                  <Fragment key={step.title}>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-1 sm:p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30">
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
                No painel você vê o Kanban, follow-up e cadastro manual — após criar sua conta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-white/5 bg-slate-950/50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Tudo o que importa para vender</h2>
            <p className="mt-3 text-slate-400">Benefícios claros, sem recurso escondido atrás de buzzword.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-6 transition hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20 transition group-hover:bg-indigo-500/25">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Como funciona</h2>
            <p className="mt-3 text-slate-400">Seis passos, do clique ao funil — alinhado ao que o sistema faz de verdade.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-6 pt-10">
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

      {/* Pricing */}
      <section className="border-t border-white/5 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-violet-950/60 p-8 shadow-2xl shadow-indigo-900/40 sm:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-500/20 blur-3xl" />
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

      {/* FAQ */}
      <section className="border-t border-white/5 bg-slate-950/40 py-20 sm:py-24">
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

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6">
          <LogoWordmark size="sm" variant="onDark" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="/login" className="transition hover:text-white">
              Entrar
            </Link>
            <a href="#demo" className="transition hover:text-white">
              Fluxo resumido
            </a>
            <span>© {new Date().getFullYear()} PageBoost</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
