import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { aggregateLeadStats } from "@/lib/dashboard-stats";
import {
  conversionRatePercent,
  filterAttentionLeads,
  leadsCreatedPerDay,
} from "@/lib/dashboard-analytics";
import { STATUS_LABELS } from "@/lib/status";
import type { LeadRow, LeadStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Clock,
  KanbanSquare,
  PieChart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { NewLeadButton } from "@/components/leads/new-lead-button";
import { attentionLabel, formatParado } from "@/lib/followup";

export const dynamic = "force-dynamic";

const ORDER: LeadStatus[] = [
  "novo",
  "em_atendimento",
  "orcamento_enviado",
  "follow_up",
  "fechado",
  "perdido",
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function rel(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} dia${d > 1 ? "s" : ""}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { organizationId } = await ensureOrganization(supabase);

  const { data: raw, error } = await supabase
    .from("leads")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Não foi possível carregar o painel: {error.message}
      </div>
    );
  }

  const rows = (raw ?? []) as LeadRow[];
  const stats = aggregateLeadStats(rows);
  const conv = conversionRatePercent(stats.byStatus);
  const attentionList = filterAttentionLeads(rows);
  const recentCreated = [...rows].slice(0, 8);
  const recentActivity = [...rows].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 8);
  const byDay = leadsCreatedPerDay(rows, 7);
  const maxDay = Math.max(1, ...byDay.map((d) => d.count));
  const weekMs = daysAgo(7);
  const fechadosSemana = rows.filter(
    (l) => l.status === "fechado" && new Date(l.updated_at).getTime() >= weekMs,
  ).length;

  let topStatus: LeadStatus = "novo";
  let topCount = -1;
  for (const s of ORDER) {
    const n = stats.byStatus[s];
    if (n > topCount) {
      topCount = n;
      topStatus = s;
    }
  }
  const topPct = stats.total === 0 ? 0 : Math.round((stats.byStatus[topStatus] / stats.total) * 100);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Visão geral</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Painel</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Leads da página pública e cadastros manuais, organizados no funil. Métricas calculadas em tempo real.
          </p>
        </div>
        <NewLeadButton organizationId={organizationId} className="self-start lg:self-auto" />
      </div>

      {stats.attentionCount > 0 && (
        <Link
          href="/follow-up"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50/90 p-5 shadow-sm transition hover:border-amber-300"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-amber-950">Follow-up pendente</p>
              <p className="mt-1 text-sm text-amber-900/85">
                {stats.attentionCount} lead{stats.attentionCount > 1 ? "s" : ""} na central (tempo parado na etapa ou coluna Follow-up).
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-amber-950">
            Ver central
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}

      {stats.total === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50/80 px-8 py-16 text-center shadow-inner">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="mt-5 text-xl font-bold text-slate-900">Comece pelo primeiro lead</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Quando alguém enviar o formulário da sua página pública, ou quando você cadastrar manualmente, os dados aparecem aqui e no Kanban.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <NewLeadButton organizationId={organizationId} />
            <Link
              href="/configuracao"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              Revisar página pública
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <PieChart className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Etapa com mais leads</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{STATUS_LABELS[topStatus]}</p>
                <p className="mt-0.5 text-sm text-slate-600">
                  {stats.byStatus[topStatus]} contato{stats.byStatus[topStatus] !== 1 ? "s" : ""} ({topPct}% do funil)
                </p>
              </div>
            </div>
            <Link
              href="/crm"
              className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50/80 sm:mt-0 sm:w-auto"
            >
              Abrir Kanban
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} title="Total de leads" value={String(stats.total)} accent="indigo" />
            <StatCard icon={Target} title="Novos" value={String(stats.byStatus.novo)} subtitle="Aguardando primeiro contato" accent="violet" />
            <StatCard
              icon={KanbanSquare}
              title="Em atendimento"
              value={String(stats.byStatus.em_atendimento)}
              accent="slate"
            />
            <StatCard
              icon={KanbanSquare}
              title="Orçamento enviado"
              value={String(stats.byStatus.orcamento_enviado)}
              accent="slate"
            />
            <StatCard
              icon={Bell}
              title="Follow-up pendente"
              value={String(stats.attentionCount)}
              subtitle="Central de alertas"
              accent="amber"
            />
            <StatCard icon={TrendingUp} title="Fechados" value={String(stats.byStatus.fechado)} accent="emerald" />
            <StatCard icon={KanbanSquare} title="Perdidos" value={String(stats.byStatus.perdido)} accent="slate" />
            <StatCard
              icon={BarChart3}
              title="Taxa de conversão"
              value={`${conv}%`}
              subtitle="Fechados ÷ total"
              accent="indigo"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Leads nos últimos 7 dias</h2>
                  <p className="mt-1 text-sm text-slate-500">Por dia de criação (formulário ou cadastro manual).</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {byDay.reduce((a, d) => a + d.count, 0)} no período
                </span>
              </div>
              <div className="mt-8 flex h-40 items-end justify-between gap-2 border-b border-slate-100 pb-1">
                {byDay.map((d) => (
                  <div key={d.iso} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold tabular-nums text-slate-700">{d.count}</span>
                    <div
                      className="w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500"
                      style={{ height: `${Math.max(8, (d.count / maxDay) * 100)}%` }}
                      title={`${d.iso}: ${d.count}`}
                    />
                    <span className="text-[10px] font-medium uppercase text-slate-400">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Fechamentos</h2>
              <p className="mt-1 text-sm text-slate-500">Leads marcados como fechado com atualização nos últimos 7 dias.</p>
              <p className="mt-8 text-4xl font-bold tabular-nums text-emerald-700">{fechadosSemana}</p>
              <p className="mt-2 text-xs text-slate-500">Baseado em data de atualização do registro.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Distribuição por etapa</h2>
                  <p className="mt-1 text-sm text-slate-500">Resumo do funil hoje.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/follow-up"
                    className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-200"
                  >
                    Follow-up
                  </Link>
                  <Link
                    href="/crm"
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Kanban
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {ORDER.map((s) => {
                  const count = stats.byStatus[s];
                  const pct = stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);
                  return (
                    <div key={s}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{STATUS_LABELS[s]}</span>
                        <span className="tabular-nums text-slate-500">
                          {count} <span className="text-slate-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-bold text-slate-900">Conversão do funil</h2>
              <p className="mt-1 text-sm text-slate-500">Percentual de cada etapa sobre o total de leads.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {ORDER.filter((s) => s !== "perdido").map((s) => {
                  const count = stats.byStatus[s];
                  const pct = stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);
                  return (
                    <li key={s} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50/80 px-3 py-2 ring-1 ring-slate-100">
                      <span className="font-medium text-slate-700">{STATUS_LABELS[s]}</span>
                      <span className="tabular-nums font-semibold text-indigo-700">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">Próximos follow-ups</h2>
                <Link href="/follow-up" className="text-xs font-bold text-amber-800 hover:underline">
                  Ver todos
                </Link>
              </div>
              {attentionList.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
                  Nenhum alerta ativo. Leads na coluna Follow-up ou parados demais na etapa aparecem aqui.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {attentionList.slice(0, 6).map((l) => (
                    <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{l.nome}</p>
                        <p className="text-xs text-slate-500">
                          {STATUS_LABELS[l.status]} · parado {formatParado(l.status_updated_at)} ·{" "}
                          {attentionLabel(l.status, l.status_updated_at)}
                        </p>
                      </div>
                      <Link
                        href={`/crm?lead=${l.id}`}
                        className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:border-indigo-200"
                      >
                        Abrir
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Atividades recentes</h2>
              <p className="mt-1 text-sm text-slate-500">Últimas atualizações nos registros (qualquer campo).</p>
              <ul className="mt-4 divide-y divide-slate-100">
                {recentActivity.map((l) => (
                  <li key={`${l.id}-act`} className="flex items-start justify-between gap-2 py-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{l.nome}</p>
                      <p className="text-xs text-slate-500">
                        Etapa: {STATUS_LABELS[l.status]} · há {rel(l.updated_at)}
                      </p>
                    </div>
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Leads recentes</h2>
              <Link href="/crm" className="text-xs font-bold text-indigo-700 hover:underline">
                Ver Kanban
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 pr-4">Nome</th>
                    <th className="py-3 pr-4">Telefone</th>
                    <th className="py-3 pr-4">Interesse</th>
                    <th className="py-3 pr-4">Etapa</th>
                    <th className="py-3 text-right">Entrada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentCreated.map((l) => (
                    <tr key={l.id} className="text-slate-700">
                      <td className="py-3 pr-4 font-medium text-slate-900">{l.nome}</td>
                      <td className="py-3 pr-4 font-mono text-xs">{l.telefone}</td>
                      <td className="max-w-[200px] truncate py-3 pr-4 text-slate-600">{l.interesse}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {STATUS_LABELS[l.status]}
                        </span>
                      </td>
                      <td className="py-3 text-right text-xs text-slate-500">{rel(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  accent,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  accent: "indigo" | "violet" | "slate" | "amber" | "emerald";
  icon: LucideIcon;
}) {
  const ring =
    accent === "indigo"
      ? "from-indigo-500/12 to-violet-500/8 ring-indigo-200/50"
      : accent === "violet"
        ? "from-violet-500/12 to-indigo-500/8 ring-violet-200/50"
        : accent === "amber"
          ? "from-amber-500/12 to-orange-500/8 ring-amber-200/60"
          : accent === "emerald"
            ? "from-emerald-500/12 to-teal-500/8 ring-emerald-200/50"
            : "from-slate-500/8 to-slate-400/5 ring-slate-200/70";

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br ${ring} p-5 shadow-sm ring-1 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-lg bg-white/95 p-2 ring-1 ring-slate-200/60">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-slate-900">{value}</p>
      {subtitle && <p className="mt-2 text-xs leading-snug text-slate-500">{subtitle}</p>}
    </div>
  );
}
