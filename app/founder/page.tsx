import Link from "next/link";
import { FounderCheckoutButtons } from "@/components/founder/founder-checkout-buttons";
import { LogoWordmark } from "@/components/brand/logo";
import { getSalesWhatsappUrl } from "@/lib/sales-whatsapp";

type Props = { searchParams?: Promise<{ cancelled?: string }> };

export default async function FounderPage(props: Props) {
  const sp = (await props.searchParams) ?? {};
  const cancelled = sp.cancelled === "1";
  const salesHref = getSalesWhatsappUrl();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-elevated)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-[var(--fg)]">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)]"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {cancelled ? (
          <p
            className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
            role="status"
          >
            Pagamento cancelado. Você pode tentar novamente quando quiser.
          </p>
        ) : null}

        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          Plano Founder
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pare de perder leads do WhatsApp por falta de organização.
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          O PageBoost cria uma página profissional para captar interessados e organiza cada lead
          em um painel simples com Kanban, follow-up e controle de atendimento.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f35] to-[#12151f] p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-4xl font-bold text-white">R$97</span>
            <span className="text-[var(--muted)]">/mês</span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Primeiras vagas com preço especial para negócios que recebem contatos pelo WhatsApp e
            querem organizar cada oportunidade sem planilha, bagunça ou esquecimento.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/90">
            {[
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
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-[var(--accent)]">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <FounderCheckoutButtons
              salesWhatsappHref={salesHref}
              monthlyLabel="Começar agora por R$97/mês"
            />
          </div>
        </div>

        <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Quer ajuda para deixar tudo pronto?</h2>
          <p className="mt-3 text-[var(--muted)]">
            Na ativação assistida, ajudamos a configurar sua página, escolher o layout, revisar o
            texto, cadastrar WhatsApp e te mostrar como usar o painel.
          </p>
          <p className="mt-4 text-sm text-white/80">
            <strong className="text-white">R$197</strong> uma vez —{" "}
            <span className="text-[var(--muted)]">opcional, não obrigatório.</span>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Quer que a gente configure tudo para você? Contrate a ativação assistida e deixamos sua
            página pronta com texto, WhatsApp, layout e orientação inicial.
          </p>
          <div className="mt-6">
            <FounderCheckoutButtons
              salesWhatsappHref={salesHref}
              showMonthly={false}
              setupLabel="Adicionar ativação assistida"
              showWhatsapp={false}
            />
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          Sem taxa obrigatória de implantação. Ativação assistida é opcional.
        </p>
      </main>
    </div>
  );
}
