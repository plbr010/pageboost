import type { Metadata } from "next";
import DemoClient from "./demo-client";

/**
 * TEMPORARY public UX audit route — no auth, no Supabase, fake data only.
 * Remove `app/demo-dashboard/`, `components/demo/`, and `lib/demo-audit-data.ts` after audit.
 */
export const metadata: Metadata = {
  title: "Demonstração · PageBoost",
  robots: { index: false, follow: false },
};

export default function DemoDashboardPage() {
  return <DemoClient />;
}
