"use client";

import { CheckCircle2 } from "lucide-react";
import { PublicLeadForm } from "@/components/public-landing/PublicLeadForm";
import type { PublicOrgPayload } from "@/components/public-landing/types";

const benefits = [
  { title: "Atendimento pelo WhatsApp", body: "Canal direto com a empresa após enviar seus dados." },
  { title: "Orçamento mais rápido", body: "Seu interesse chega organizado para agilizar a resposta." },
  { title: "Retorno organizado", body: "Sua solicitação entra no fluxo de atendimento da equipe." },
] as const;

const steps = ["Preencha seus dados", "Chame no WhatsApp", "Aguarde o retorno da empresa"] as const;

export function PublicLandingDefault({ org, slug }: { org: PublicOrgPayload; slug: string }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-5 py-5 md:py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{org.name}</p>
          <p className="mt-1 text-sm text-slate-500">Atendimento pelo WhatsApp</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-16 pt-8 md:pb-20 md:pt-10">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl md:leading-snug">
          {org.titulo_landing}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{org.descricao_landing}</p>

        <div className="mt-10">
          <PublicLeadForm org={org} slug={slug} />
        </div>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-200/90 bg-white/80 p-4 shadow-sm ring-1 ring-slate-100"
            >
              <CheckCircle2 className="h-5 w-5 text-indigo-600" aria-hidden />
              <p className="mt-3 text-sm font-bold text-slate-900">{b.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{b.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 md:p-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider text-indigo-800">Como funciona</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((label, i) => (
              <li key={label} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 font-medium leading-snug">{label}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/80 py-6 text-center text-[11px] text-slate-400">
        Página gerada por PageBoost
      </footer>
    </div>
  );
}
