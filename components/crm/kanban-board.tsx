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
            "scroll-mt-40 rounded-xl border bg-white p-3.5 shadow-md ring-1 transition-all duration-200",
            colFollowUp && "border-violet-300 ring-violet-200/80 shadow-violet-500/10",
            !colFollowUp && banner && "border-amber-200 ring-amber-100/90 shadow-amber-500/5",
            !colFollowUp && !banner && "border-slate-200/90 ring-slate-100",
            snapshot.isDragging && "scale-[1.02] rotate-1 shadow-2xl ring-2 ring-indigo-300/60",
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

    const newStatus = destination.droppableId as LeadStatus;
    const id = draggableId;

    setLeads((prev) => {
      const moved = prev.find((l) => l.id === id);
      if (!moved) return prev;
      return prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    });

    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      window.location.reload();
      return;
    }

    setLeads((cur) => cur.map((l) => (l.id === id ? (data as LeadRow) : l)));
  }, []);

  return (
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
                    "min-h-[360px] flex-1 space-y-2.5 rounded-2xl border-2 border-dashed p-2.5 transition-all duration-200",
                    status === "follow_up" && "border-violet-200/80 bg-gradient-to-b from-violet-50/90 to-violet-50/20",
                    status !== "follow_up" && "border-slate-200/80 bg-slate-100/50",
                    snapshot.isDraggingOver && "border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-200/50",
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
  );
}
