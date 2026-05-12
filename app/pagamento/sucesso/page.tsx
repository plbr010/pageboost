import Link from "next/link";
import { LogoWordmark } from "@/components/brand/logo";
import { getSalesWhatsappUrl } from "@/lib/sales-whatsapp";

type Props = { searchParams?: Promise<{ session_id?: string }> };

export default async function PagamentoSucessoPage(props: Props) {
  const sp = (await props.searchParams) ?? {};
  const sessionId = typeof sp.session_id === "string" ? sp.session_id.trim() : "";
  const salesHref = getSalesWhatsappUrl();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-elevated)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-[var(--fg)]">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pagamento confirmado
        </h1>
        {sessionId ? (
          <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Seu pagamento foi iniciado com sucesso.
          </p>
        ) : null}
        <p className="mt-6 text-[var(--muted)]">
          Agora crie sua conta e configure sua página pública para começar a captar leads pelo
          WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Criar minha conta
          </Link>
          {salesHref ? (
            <a
              href={salesHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/5"
            >
              Falar no WhatsApp
            </a>
          ) : null}
        </div>
        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          <Link href="/founder" className="underline hover:text-white">
            Voltar à oferta Founder
          </Link>
        </p>
      </main>
    </div>
  );
}
