import { PublicLeadForm } from "@/components/public-landing/PublicLeadForm";
import type { PublicOrgPayload } from "@/components/public-landing/types";

export function SimpleLanding({ org, slug }: { org: PublicOrgPayload; slug: string }) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-lg px-5 py-8 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{org.name}</p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
            {org.titulo_landing}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{org.descricao_landing}</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-10 md:py-12">
        <PublicLeadForm org={org} slug={slug} variant="simple" />
        <p className="mt-10 text-center text-[11px] text-slate-400">Página gerada por PageBoost</p>
      </div>
    </div>
  );
}
