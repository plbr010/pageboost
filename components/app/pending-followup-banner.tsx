"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAttentionCount } from "@/components/app/attention-context";

const STORAGE_KEY = "pb_dismiss_attention_until";

export function PendingFollowupBanner() {
  const { count } = useAttentionCount();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (count === 0) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* */
      }
      setDismissed(false);
      return;
    }
    try {
      const until = sessionStorage.getItem(STORAGE_KEY);
      if (!until || Number.isNaN(Number(until)) || Date.now() > Number(until)) {
        if (until) sessionStorage.removeItem(STORAGE_KEY);
        setDismissed(false);
        return;
      }
      setDismissed(true);
    } catch {
      setDismissed(false);
    }
  }, [count]);

  if (count <= 0 || dismissed) return null;

  return (
    <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="text-sm font-medium text-amber-950">
          Você tem{" "}
          <strong>
            {count} lead{count > 1 ? "s" : ""}
          </strong>{" "}
          na central de follow-up (tempo parado na etapa ou coluna Follow-up).
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/follow-up"
            className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
          >
            Ver agora
          </Link>
          <button
            type="button"
            aria-label="Dispensar aviso"
            className="rounded-full p-1.5 text-amber-900/70 transition hover:bg-amber-200/60"
            onClick={() => {
              try {
                sessionStorage.setItem(STORAGE_KEY, String(Date.now() + 4 * 60 * 60 * 1000));
              } catch {
                /* */
              }
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
