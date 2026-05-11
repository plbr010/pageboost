import { CheckCircle2, Sparkles } from "lucide-react";
import { PublicLeadForm } from "@/components/public-landing/PublicLeadForm";
import type { PublicOrgPayload } from "@/components/public-landing/types";

const benefits = [
  { title: "Atendimento pelo WhatsApp", body: "Canal direto com a empresa após enviar seus dados." },
  { title: "Orçamento mais rápido", body: "Seu interesse chega organizado para agilizar a resposta." },
  { title: "Retorno organizado", body: "Sua solicitação entra no fluxo de atendimento da equipe." },
] as const;

const steps = [
  "Preencha seus dados",
  "Chame no WhatsApp",
  "Aguarde o retorno da empresa",
] as const;

export function PremiumLanding({ org, slug }: { org: PublicOrgPayload; slug: string }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#070b18] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(100% 70% at 50% -10%, rgba(79,70,229,0.35) 0%, transparent 55%), radial-gradient(80% 50% at 100% 0%, rgba(91,33,182,0.2) 0%, transparent 45%)",
        }}
        aria-hidden
      />

      <header className="border-b border-white/5 bg-[#070b18]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-5 py-10 text-center md:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            {org.name}
          </p>
          <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {org.titulo_landing}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">{org.descricao_landing}</p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Por que enviar aqui</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-white">{b.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 pb-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Como funciona</h2>
        <ol className="mt-6 space-y-3 text-sm text-slate-300">
          {steps.map((s, idx) => (
            <li key={s} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-100">
                {idx + 1}
              </span>
              <span className="pt-0.5 leading-snug">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-lg px-5 pb-16">
        <PublicLeadForm org={org} slug={slug} variant="premium" />
        <p className="mt-10 text-center text-[11px] text-slate-600">Página gerada por PageBoost</p>
      </div>
    </div>
  );
}
