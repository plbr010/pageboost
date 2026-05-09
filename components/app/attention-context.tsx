"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/** Intervalo entre atualizações do contador (aba visível). Evita polling agressivo. */
const POLL_MS = 180_000;

type Ctx = {
  count: number;
  refresh: () => Promise<void>;
};

const AttentionContext = createContext<Ctx | null>(null);

export function AttentionProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(initialCount);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/attention-count", { cache: "no-store" });
      if (!r.ok) return;
      const j = (await r.json()) as { count?: number };
      if (typeof j.count === "number") setCount(j.count);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function clearPoll() {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function startPollIfVisible() {
      clearPoll();
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      intervalRef.current = window.setInterval(() => {
        if (document.visibilityState === "visible") void refresh();
      }, POLL_MS);
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        void refresh();
        startPollIfVisible();
      } else {
        clearPoll();
      }
    }

    startPollIfVisible();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearPoll();
    };
  }, [refresh]);

  const value = useMemo(() => ({ count, refresh }), [count, refresh]);

  return <AttentionContext.Provider value={value}>{children}</AttentionContext.Provider>;
}

export function useAttentionCount() {
  const ctx = useContext(AttentionContext);
  if (!ctx) {
    return { count: 0, refresh: async () => {} };
  }
  return ctx;
}
