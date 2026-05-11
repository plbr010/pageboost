"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { followupBanner, isFollowUpColumn } from "@/lib/followup";
import { LEAD_LIST_COLUMNS } from "@/lib/leads-columns";
import { PIPELINE_STATUSES, STATUS_LABELS } from "@/lib/status";
import type { LeadRow, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ResetStatusClockButton } from "@/components/leads/reset-status-clock-button";
import { Bell, Calendar, GripVertical } from "lucide-react";

function groupByStatus(leads: LeadRow[]): Record<LeadStatus, LeadRow[]> {
  const map = PIPELINE_STATUSES.reduce(
    (acc, s) => {
      acc[s] = [];
      return acc;
    },
    {} as Record<LeadStatus, LeadRow[]>,
  );
  for (const l of leads) {
    if (map[l.status]) map[l.status].push(l);
  }
  return map;
}

function flattenOrdered(grouped: Record<LeadStatus, LeadRow[]>): LeadRow[] {
  return PIPELINE_STATUSES.flatMap((s) => grouped[s]);
}

const LeadCard = memo(function LeadCard({ lead, index }: { lead: LeadRow; index: number }) {
  const banner = followupBanner(lead.status, lead.status_updated_at);
  const colFollowUp = isFollowUpColumn(lead.status);
  const dateStr = new Date(lead.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          id={`lead-card-${lead.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "scroll-mt-40 rounded-xl border bg-white p-3.5 shadow-sm ring-1 ring-slate-200/80",
            colFollowUp && "border-violet-300 ring-violet-200/70",
            !colFollowUp && banner && "border-amber-200 ring-amber-100/80",
            !colFollowUp && !banner && "border-slate-200/90",
            snapshot.isDragging && "ring-2 ring-indigo-400/70 shadow-md",
          )}
        >
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="mt-1 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              {...provided.dragHandleProps}
              aria-label="Arrastar card"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold leading-snug text-slate-900">{lead.nome}</p>
                {colFollowUp && (
                  <span className="shrink-0 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Follow-up
                  </span>
                )}
                {!colFollowUp && banner === "follow_up_recomendado" && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-950 ring-1 ring-amber-200/80">
                    <Bell className="h-3 w-3" />
                    48h+
                  </span>
                )}
                {!colFollowUp && banner === "cobrar_retorno" && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-950 ring-1 ring-orange-200/80">
                    <Bell className="h-3 w-3" />
                    72h+
                  </span>
                )}
              </div>
              <p className="truncate font-mono text-[11px] text-slate-500" title={lead.telefone}>
                {lead.telefone}
              </p>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600" title={lead.interesse}>
                {lead.interesse}
              </p>
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {dateStr}
                </span>
                <ResetStatusClockButton leadId={lead.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

export function KanbanBoard({
  initialLeads,
  focusLeadId = null,
}: {
  initialLeads: LeadRow[];
  focusLeadId?: string | null;
}) {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads);
  const [persistError, setPersistError] = useState<string | null>(null);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const grouped = useMemo(() => groupByStatus(leads), [leads]);

  useEffect(() => {
    if (!focusLeadId) return;
    const el = document.getElementById(`lead-card-${focusLeadId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-indigo-500", "ring-offset-2");
    const t = window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-indigo-500", "ring-offset-2");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [focusLeadId, leads]);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceCol = source.droppableId as LeadStatus;
    const destCol = destination.droppableId as LeadStatus;

    if (sourceCol === destCol) {
      setPersistError(null);
      setLeads((prev) => {
        const g = groupByStatus(prev);
        const list = [...g[sourceCol]];
        const fromIndex = list.findIndex((l) => l.id === draggableId);
        if (fromIndex < 0) return prev;
        const [moved] = list.splice(fromIndex, 1);
        list.splice(destination.index, 0, moved);
        g[sourceCol] = list;
        return flattenOrdered(g);
      });
      return;
    }

    const now = new Date().toISOString();
    let rollback: LeadRow[] = [];

    setLeads((prev) => {
      rollback = [...prev];
      const g = groupByStatus(prev);
      const start = [...g[sourceCol]];
      const fromIndex = start.findIndex((l) => l.id === draggableId);
      if (fromIndex < 0) return prev;
      const [moved] = start.splice(fromIndex, 1);
      const updatedLead: LeadRow = {
        ...moved,
        status: destCol,
        status_updated_at: now,
        updated_at: now,
      };
      const finish = [...g[destCol]];
      finish.splice(destination.index, 0, updatedLead);
      g[sourceCol] = start;
      g[destCol] = finish;
      return flattenOrdered(g);
    });

    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .update({
        status: destCol,
        status_updated_at: now,
        updated_at: now,
      })
      .eq("id", draggableId)
      .select(LEAD_LIST_COLUMNS)
      .single();

    if (error || !data) {
      setLeads(rollback);
      setPersistError("Não foi possível salvar a etapa. Verifique sua conexão e tente de novo.");
      return;
    }

    setPersistError(null);
    setLeads((cur) => cur.map((l) => (l.id === draggableId ? (data as LeadRow) : l)));
  }, []);

  return (
    <div className="space-y-3">
      {persistError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {persistError}
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 pt-1">
          {PIPELINE_STATUSES.map((status) => (
            <div key={status} className="flex w-[280px] shrink-0 flex-col sm:w-[300px]">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-700">
                  {grouped[status].length}
                </span>
              </div>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[360px] flex-1 space-y-2.5 rounded-2xl border-2 border-dashed p-2.5",
                      status === "follow_up" && "border-violet-200/80 bg-violet-50/50",
                      status !== "follow_up" && "border-slate-200/80 bg-slate-100/50",
                      snapshot.isDraggingOver && "border-indigo-400 bg-indigo-50/80 ring-1 ring-indigo-200/60",
                    )}
                  >
                    {grouped[status].map((lead, index) => (
                      <LeadCard key={lead.id} lead={lead} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
