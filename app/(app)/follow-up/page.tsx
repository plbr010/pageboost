import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { attentionLabel, formatParado, leadNeedsAttention } from "@/lib/followup";
import { STATUS_LABELS } from "@/lib/status";
import type { LeadRow } from "@/lib/types";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { LEAD_LIST_COLUMNS } from "@/lib/leads-columns";
import { ResetStatusClockButton } from "@/components/leads/reset-status-clock-button";
import { Bell, ExternalLink, LayoutGrid, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FollowUpPage() {
  const supabase = await createClient();
  const { organizationId } = await ensureOrganization(supabase);

  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_LIST_COLUMNS)
    .eq("organization_id", organizationId)
    .order("status_updated_at", { ascending: true })
    .limit(400);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {error.message}
      </div>
    );
  }

  const all = (data ?? []) as LeadRow[];
  const list = all
    .filter((l) => leadNeedsAttention(l.status, l.status_updated_at))
    .sort(
      (a, b) =>
        new Date(a.status_updated_at).getTime() - new Date(b.status_updated_at).getTime(),
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
            <Bell className="h-3.5 w-3.5" />
            Central de follow-up
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Leads que precisam de atenção</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            Contamos o tempo a partir de <strong>status_updated_at</strong> (última mudança de etapa ou ao clicar em “Zerar relógio”). Em{" "}
            <strong>Em atendimento</strong> passou de 48h sem mudança, em <strong>Orçamento enviado</strong> passou de 72h, ou o lead está na coluna{" "}
            <strong>Follow-up</strong>.
          </p>
        </div>
        <Link
          href="/crm"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
        >
          <LayoutGrid className="h-4 w-4 text-indigo-600" />
          Abrir Kanban
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-8 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Bell className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">Tudo em dia</p>
          <p className="mt-2 text-sm text-slate-600">
            Nenhum lead nesta lista agora. Quando alguém parar demais na etapa, aparece aqui automaticamente.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Voltar ao painel
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Lead</th>
                  <th className="px-5 py-4">Telefone</th>
                  <th className="px-5 py-4">Interesse</th>
                  <th className="px-5 py-4">Etapa</th>
                  <th className="px-5 py-4">Parado há</th>
                  <th className="px-5 py-4">Motivo</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((lead) => {
                  const wa = buildWhatsappUrl(lead.telefone, `Olá, ${lead.nome}!`);
                  return (
                    <tr key={lead.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{lead.nome}</p>
                        {lead.observacao && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{lead.observacao}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-700">{lead.telefone}</td>
                      <td className="max-w-[200px] px-5 py-4 text-slate-600">
                        <span className="line-clamp-2">{lead.interesse}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/80">
                          {formatParado(lead.status_updated_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">{attentionLabel(lead.status, lead.status_updated_at)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <ResetStatusClockButton leadId={lead.id} compact />
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
                          >
                            WhatsApp
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <Link
                            href={`/crm?lead=${lead.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-900 transition hover:bg-indigo-100"
                          >
                            <Pencil className="h-3 w-3" />
                            Abrir no Kanban
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
