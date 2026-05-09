"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  leadId: string;
  compact?: boolean;
};

export function ResetStatusClockButton({ leadId, compact }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("reset_lead_status_clock", { lead_id: leadId });
      if (error) throw error;
      router.refresh();
    } catch {
      /* keep open for retry */
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={loading}
      className={
        compact
          ? "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
          : "inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-800 disabled:opacity-50"
      }
      title="Registra contato nesta etapa — zera o relógio para alertas de follow-up"
    >
      <PhoneCall className="h-3.5 w-3.5" />
      {loading ? "…" : "Zerar relógio"}
    </button>
  );
}
