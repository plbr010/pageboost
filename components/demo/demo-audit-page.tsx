"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Clock,
  Copy,
  ExternalLink,
  KanbanSquare,
  PieChart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { DemoShell } from "@/components/demo/demo-shell";
import { DemoStatCard } from "@/components/demo/demo-stat-card";
import { DemoKanbanBoard } from "@/components/demo/demo-kanban-board";
import { DemoNewLeadModal } from "@/components/demo/demo-new-lead-modal";
import { buildInitialDemoLeads, DEMO_ORG_SETTINGS, DEMO_PIPELINE_ORDER as ORDER } from "@/lib/demo-audit-data";
import { aggregateLeadStats } from "@/lib/dashboard-stats";
import { conversionRatePercent, filterAttentionLeads, leadsCreatedPerDay } from "@/lib/dashboard-analytics";
import { attentionLabel, formatParado, leadNeedsAttention } from "@/lib/followup";
import { STATUS_LABELS } from "@/lib/status";
import type { LeadRow, LeadStatus } from "@/lib/types";
import { buildWhatsappUrl } from "@/lib/whatsapp";

function daysAgoMs(n: number) {
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

export function DemoAuditPage() {
  const [leads, setLeads] = useState<LeadRow[]>(() => buildInitialDemoLeads());
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => aggregateLeadStats(leads), [leads]);
  const conv = useMemo(() => conversionRatePercent(stats.byStatus), [stats.byStatus]);
  const attentionList = useMemo(() => filterAttentionLeads(leads), [leads]);
  const followUpTable = useMemo(() => {
    return [...leads]
      .filter((l) => leadNeedsAttention(l.status, l.status_updated_at))
      .sort(
        (a, b) =>
          new Date(a.status_updated_at).getTime() - new Date(b.status_updated_at).getTime(),
      );
  }, [leads]);

  const recentCreated = useMemo(() => [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8), [leads]);
  const recentActivity = useMemo(
    () =>
      [...leads]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 8),
    [leads],
  );
  const byDay = useMemo(() => leadsCreatedPerDay(leads, 7), [leads]);
  const maxDay = useMemo(() => Math.max(1, ...byDay.map((d) => d.count)), [byDay]);
  const weekMs = daysAgoMs(7);
  const fechadosSemana = useMemo(
    () => leads.filter((l) => l.status === "fechado" && new Date(l.updated_at).getTime() >= weekMs).length,
    [leads, weekMs],
  );

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

  const onAddLead = useCallback((lead: LeadRow) => {
    setLeads((prev) => [lead, ...prev]);
  }, []);

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/l/${DEMO_ORG_SETTINGS.slug}` : `/l/${DEMO_ORG_SETTINGS.slug}`;

  async function copyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <DemoShell attentionBadge={stats.attentionCount}>
      <div className="space-y-12 pb-16">
        <section id="painel" className="scroll-mt-28 space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Visão geral (demo)</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Painel</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Pré-visualização do funil com métricas fictícias. Nenhum dado vem do Supabase.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="pb-btn-primary self-start px-5 py-2.5 text-sm font-semibold lg:self-auto"
            >
              Novo lead
            </button>
          </div>

          {stats.attentionCount > 0 && (
            <Link
              href="#follow-up"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50/90 p-5 shadow-sm transition hover:border-amber-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-amber-950">Follow-up pendente</p>
                  <p className="mt-1 text-sm text-amber-900/85">
                    {stats.attentionCount} lead{stats.attentionCount > 1 ? "s" : ""} na central (regras de tempo iguais ao produto).
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
              <p className="mt-5 text-xl font-bold text-slate-900">Estado vazio (demo)</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Sem leads fictícios neste cenário. Use &quot;Novo lead&quot; para preencher só nesta sessão.
              </p>
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
                  href="#kanban"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50/80 sm:mt-0 sm:w-auto"
                >
                  Ir ao Kanban
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DemoStatCard icon={Users} title="Total de leads" value={String(stats.total)} accent="indigo" />
                <DemoStatCard icon={Target} title="Novos" value={String(stats.byStatus.novo)} subtitle="Aguardando primeiro contato" accent="violet" />
                <DemoStatCard icon={KanbanSquare} title="Em atendimento" value={String(stats.byStatus.em_atendimento)} accent="slate" />
                <DemoStatCard icon={KanbanSquare} title="Orçamento enviado" value={String(stats.byStatus.orcamento_enviado)} accent="slate" />
                <DemoStatCard
                  icon={Bell}
                  title="Follow-ups pendentes"
                  value={String(stats.attentionCount)}
                  subtitle="Central de alertas (regras reais, dados fake)"
                  accent="amber"
                />
                <DemoStatCard icon={TrendingUp} title="Fechados" value={String(stats.byStatus.fechado)} accent="emerald" />
                <DemoStatCard icon={KanbanSquare} title="Perdidos" value={String(stats.byStatus.perdido)} accent="slate" />
                <DemoStatCard icon={BarChart3} title="Taxa de conversão" value={`${conv}%`} subtitle="Fechados ÷ total" accent="indigo" />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Leads nos últimos 7 dias</h2>
                      <p className="mt-1 text-sm text-slate-500">Por dia de criação (simulado).</p>
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
                  <p className="mt-1 text-sm text-slate-500">Fechados com atualização nos últimos 7 dias.</p>
                  <p className="mt-8 text-4xl font-bold tabular-nums text-emerald-700">{fechadosSemana}</p>
                  <p className="mt-2 text-xs text-slate-500">Baseado em data de atualização do registro fictício.</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Distribuição por etapa</h2>
                      <p className="mt-1 text-sm text-slate-500">Resumo do funil (demo).</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="#follow-up"
                        className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-200"
                      >
                        Follow-up
                      </Link>
                      <Link
                        href="#kanban"
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
                  <p className="mt-1 text-sm text-slate-500">Percentual de cada etapa sobre o total.</p>
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
                    <Link href="#follow-up" className="text-xs font-bold text-amber-800 hover:underline">
                      Ver lista completa
                    </Link>
                  </div>
                  {attentionList.length === 0 ? (
                    <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
                      Nenhum alerta neste conjunto fictício.
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
                          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                            Demo
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">Atividades recentes</h2>
                  <p className="mt-1 text-sm text-slate-500">Últimas atualizações nos registros fictícios.</p>
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
                  <Link href="#kanban" className="text-xs font-bold text-indigo-700 hover:underline">
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
        </section>

        <section id="follow-up" className="scroll-mt-28 space-y-8 border-t border-slate-200/80 pt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
                <Bell className="h-3.5 w-3.5" />
                Central de follow-up (demo)
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Leads que precisam de atenção</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                Mesmas regras do produto (48h em atendimento, 72h em orçamento, coluna Follow-up), aplicadas aos dados fictícios.
              </p>
            </div>
            <Link
              href="#kanban"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              <KanbanSquare className="h-4 w-4 text-indigo-600" />
              Ir ao Kanban
            </Link>
          </div>

          {followUpTable.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 px-8 py-16 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Estado vazio</p>
              <p className="mt-2 text-sm text-slate-600">Nenhum lead fictício atende aos critérios de alerta agora.</p>
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
                    {followUpTable.map((lead) => {
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
                              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-500">
                                Zerar relógio (demo)
                              </span>
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
                              >
                                WhatsApp
                                <ExternalLink className="h-3 w-3" />
                              </a>
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
        </section>

        <section id="kanban" className="scroll-mt-28 space-y-6 border-t border-slate-200/80 pt-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Funil</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Kanban</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Arrastar altera só o estado local desta página — nada é salvo no servidor.
            </p>
          </div>
          <DemoKanbanBoard leads={leads} onLeadsChange={setLeads} />
        </section>

        <section id="novo-lead" className="scroll-mt-28 space-y-4 border-t border-slate-200/80 pt-12">
          <h2 className="text-2xl font-bold text-slate-900">Cadastrar lead (demo)</h2>
          <p className="text-sm text-slate-600">
            O botão abre o mesmo fluxo visual de criação; os dados permanecem apenas nesta aba até recarregar.
          </p>
          <button type="button" onClick={() => setModalOpen(true)} className="pb-btn-primary px-5 py-2.5 text-sm font-semibold">
            Abrir modal &quot;Novo lead&quot;
          </button>
        </section>

        <section id="config" className="scroll-mt-28 space-y-6 border-t border-slate-200/80 pt-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Página pública (simulada)</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Configurações</h2>
            <p className="mt-2 text-sm text-amber-900/90">
              Textos abaixo são fixos para auditoria — não refletem sua organização real.
            </p>
          </div>

          <div className="grid gap-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
            <div className="space-y-4">
              <Field label="Nome da empresa" value={DEMO_ORG_SETTINGS.name} />
              <Field label="WhatsApp (exibição)" value={DEMO_ORG_SETTINGS.whatsapp} mono />
              <Field label="Título da página pública" value={DEMO_ORG_SETTINGS.titulo_landing} />
              <Field label="Descrição" value={DEMO_ORG_SETTINGS.descricao_landing} multiline />
            </div>
            <div className="space-y-4">
              <div>
                <p className="pb-label">Slug / link público</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <code className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800">
                    {publicUrl}
                  </code>
                  <button
                    type="button"
                    onClick={() => void copyPublicLink()}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-100"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado" : "Copiar link"}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-emerald-950">Página ativa (demonstração)</p>
                  <p className="text-xs text-emerald-900/80">No produto real, isso reflete o status no Supabase.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <DemoNewLeadModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={onAddLead} />
    </DemoShell>
  );
}

function Field({ label, value, mono, multiline }: { label: string; value: string; mono?: boolean; multiline?: boolean }) {
  return (
    <div>
      <p className="pb-label">{label}</p>
      <p
        className={`mt-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-800 ${mono ? "font-mono text-xs" : ""} ${multiline ? "leading-relaxed" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
