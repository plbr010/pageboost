"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewLeadModal } from "@/components/leads/new-lead-modal";
import { cn } from "@/lib/cn";

export function NewLeadButton({
  organizationId,
  variant = "primary",
  className,
}: {
  organizationId: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "primary"
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
      : variant === "outline"
        ? "border border-slate-200 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50/40"
        : "border border-transparent text-slate-700 hover:bg-slate-100";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
          base,
          className,
        )}
      >
        <Plus className="h-4 w-4" />
        Novo lead
      </button>
      <NewLeadModal organizationId={organizationId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
