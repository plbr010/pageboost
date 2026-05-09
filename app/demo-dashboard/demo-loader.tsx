"use client";

import dynamic from "next/dynamic";

const DemoAuditPage = dynamic(
  () => import("@/components/demo/demo-audit-page").then((m) => ({ default: m.DemoAuditPage })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--pb-bg)] px-4 text-center text-slate-600">
        Carregando demonstração…
      </div>
    ),
  },
);

export default function DemoLoader() {
  return <DemoAuditPage />;
}
