"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, KanbanSquare, LayoutDashboard, PlusCircle, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const sections: { hash: string; label: string; icon: LucideIcon; highlight?: boolean }[] = [
  { hash: "#painel", label: "Painel", icon: LayoutDashboard },
  { hash: "#follow-up", label: "Follow-up", icon: Bell, highlight: true },
  { hash: "#kanban", label: "Kanban", icon: KanbanSquare },
  { hash: "#novo-lead", label: "Novo lead", icon: PlusCircle },
  { hash: "#config", label: "Configurações", icon: Settings },
];

function sideNavItemClass(highlight?: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    "text-slate-400 hover:bg-white/5 hover:text-white",
    highlight && "text-amber-200/90 hover:text-amber-100",
  );
}

export function DemoSidebarNav({
  attentionBadge,
  mobile = false,
}: {
  attentionBadge: number;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const base = pathname || "/demo-dashboard";

  if (mobile) {
    return (
      <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200/80 bg-white px-3 py-2.5 md:hidden">
        {sections.map((item) => {
          const Icon = item.icon;
          const showFu = item.highlight && attentionBadge > 0;
          return (
            <Link
              key={item.hash}
              href={`${base}${item.hash}`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
              {showFu ? (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                  {attentionBadge > 99 ? "99+" : attentionBadge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex-1 space-y-1 p-3">
      {sections.map((item) => {
        const Icon = item.icon;
        const badge =
          item.highlight && attentionBadge > 0 ? (
            <span className="flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-950">
              {attentionBadge > 99 ? "99+" : attentionBadge}
            </span>
          ) : item.highlight ? (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/80">
              Central
            </span>
          ) : null;
        return (
          <Link key={item.hash} href={`${base}${item.hash}`} className={cn(sideNavItemClass(item.highlight), "pb-focus")}>
            <Icon className="h-4 w-4 shrink-0 text-indigo-300" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {badge}
          </Link>
        );
      })}
    </nav>
  );
}
