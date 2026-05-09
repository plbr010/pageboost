"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAttentionCount } from "@/components/app/attention-context";

const nav: { href: string; label: string; icon: LucideIcon; highlight?: boolean }[] = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/follow-up", label: "Follow-up", icon: Bell, highlight: true },
  { href: "/crm", label: "Kanban", icon: KanbanSquare },
  { href: "/configuracao", label: "Configurações", icon: Settings },
];

function linkClass(active: boolean, highlight?: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    active && "bg-white/10 text-white shadow-inner shadow-black/20",
    !active && "text-slate-400 hover:bg-white/5 hover:text-white",
    highlight && !active && "text-amber-200/90 hover:text-amber-100",
  );
}

export function SidebarNavLinks() {
  const pathname = usePathname();
  const { count: attentionCount } = useAttentionCount();
  return (
    <nav className="flex-1 space-y-1 p-3">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        const badge =
          item.highlight && attentionCount > 0 ? (
            <span className="flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-950">
              {attentionCount > 99 ? "99+" : attentionCount}
            </span>
          ) : item.highlight ? (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/80">
              Central
            </span>
          ) : null;
        return (
          <Link key={item.href} href={item.href} className={cn(linkClass(active, item.highlight), "pb-focus")}>
            <Icon className={cn("h-4 w-4 shrink-0", active && "text-indigo-300")} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {badge}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();
  const { count: attentionCount } = useAttentionCount();
  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200/80 bg-white px-3 py-2.5 md:hidden">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        const showFu = item.highlight && attentionCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
            {showFu ? (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                {attentionCount > 99 ? "99+" : attentionCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
