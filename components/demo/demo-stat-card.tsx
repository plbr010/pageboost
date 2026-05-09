import type { LucideIcon } from "lucide-react";

export function DemoStatCard({
  title,
  value,
  subtitle,
  accent,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  accent: "indigo" | "violet" | "slate" | "amber" | "emerald";
  icon: LucideIcon;
}) {
  const ring =
    accent === "indigo"
      ? "from-indigo-500/12 to-violet-500/8 ring-indigo-200/50"
      : accent === "violet"
        ? "from-violet-500/12 to-indigo-500/8 ring-violet-200/50"
        : accent === "amber"
          ? "from-amber-500/12 to-orange-500/8 ring-amber-200/60"
          : accent === "emerald"
            ? "from-emerald-500/12 to-teal-500/8 ring-emerald-200/50"
            : "from-slate-500/8 to-slate-400/5 ring-slate-200/70";

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br ${ring} p-5 shadow-sm ring-1 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-lg bg-white/95 p-2 ring-1 ring-slate-200/60">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-slate-900">{value}</p>
      {subtitle && <p className="mt-2 text-xs leading-snug text-slate-500">{subtitle}</p>}
    </div>
  );
}
