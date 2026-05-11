import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { KanbanBoard } from "@/components/crm/kanban-board";
import { NewLeadButton } from "@/components/leads/new-lead-button";
import { leadNeedsAttention } from "@/lib/followup";
import type { LeadRow } from "@/lib/types";
import { KanbanSquare } from "lucide-react";
import { LEAD_LIST_COLUMNS } from "@/lib/leads-columns";

export const dynamic = "force-dynamic";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ alerta?: string; lead?: string }>;
}) {
  const sp = await searchParams;
  const alertaOnly = sp.alerta === "1";
  const focusLeadId = sp.lead?.trim() || null;

  const supabase = await createClient();
  const { organizationId } = await ensureOrganization(supabase);

  const { data: raw, error } = await supabase
    .from("leads")
    .select(LEAD_LIST_COLUMNS)
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(400);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Não foi possível carregar leads: {error.message}
      </div>
    );
  }

  const all = (raw ?? []) as LeadRow[];
  const leads = alertaOnly
    ? all.filter((l) => leadNeedsAttention(l.status, l.status_updated_at))
    : all;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-800">
            <KanbanSquare className="h-3.5 w-3.5" />
            Pipeline
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Kanban</h1>
          <p className="mt-2 max-w-xl text-slate-600">
            Arraste os cards para mudar a etapa. O status <strong>não</strong> muda sozinho pelo WhatsApp — você controla tudo aqui.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/crm"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              !alertaOnly
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Todos os leads
          </Link>
          <Link
            href="/crm?alerta=1"
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              alertaOnly
                ? "bg-amber-500 text-white shadow-lg shadow-amber-600/25"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Só alertas
          </Link>
          <Link
            href="/follow-up"
            className="rounded-full border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
          >
            Lista de follow-up
          </Link>
        </div>
      </div>

      {alertaOnly && leads.length === 0 && (
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-6 py-5 text-sm text-emerald-900 shadow-sm">
          Nenhum lead com alerta neste filtro.{" "}
          <Link href="/follow-up" className="font-semibold underline underline-offset-2">
            Ver central de follow-up
          </Link>
        </div>
      )}

      {all.length === 0 && !alertaOnly ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50 px-8 py-14 text-center shadow-inner">
          <p className="text-lg font-bold text-slate-900">Nenhum lead no funil ainda</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Cadastre o primeiro manualmente ou compartilhe sua página pública nas configurações.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <NewLeadButton organizationId={organizationId} />
            <Link
              href="/configuracao"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200"
            >
              Configurar página
            </Link>
          </div>
        </div>
      ) : (
        <KanbanBoard initialLeads={leads} focusLeadId={focusLeadId} />
      )}
    </div>
  );
}
