import Link from "next/link";
import { LogoWordmark } from "@/components/brand/logo";
import { DemoSidebarNav } from "@/components/demo/demo-sidebar-nav";
import { AlertTriangle, LogOut } from "lucide-react";

export function DemoShell({
  children,
  attentionBadge,
}: {
  children: React.ReactNode;
  attentionBadge: number;
}) {
  return (
    <div className="flex min-h-dvh items-start bg-[var(--pb-bg)] text-slate-900">
      <aside className="sticky top-0 z-30 hidden h-dvh max-h-dvh w-64 shrink-0 flex-col border-r border-white/10 bg-[var(--pb-sidebar)] md:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-5">
          <Link href="/demo-dashboard#painel" className="pb-focus rounded-lg">
            <LogoWordmark size="sm" variant="onDark" />
          </Link>
        </div>
        <div className="shrink-0 border-b border-white/10 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Demonstração</p>
          <p className="mt-1 truncate text-sm font-medium text-amber-200/95" title="Dados fictícios para auditoria">
            Modo auditoria (sem login)
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <DemoSidebarNav attentionBadge={attentionBadge} />
        </div>
        <div className="border-t border-white/10 p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Visitante</p>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/90 text-xs font-bold text-slate-950"
              aria-hidden
            >
              A
            </div>
            <p className="min-w-0 flex-1 truncate text-xs leading-snug text-slate-300" title="Conta de demonstração">
              auditoria@demo (somente leitura visual)
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center md:px-8">
          <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-amber-950 md:text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            Rota temporária de UX — dados 100% fictícios, sem Supabase e sem persistência.
          </p>
        </div>

        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/90 bg-white px-4 shadow-sm md:h-16 md:px-8">
          <div className="flex min-w-0 items-center gap-3 md:hidden">
            <Link href="/demo-dashboard#painel" className="pb-focus rounded-lg">
              <LogoWordmark size="sm" variant="onLight" />
            </Link>
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Demonstração</p>
            <p className="truncate text-sm font-semibold text-slate-900">PageBoost — pré-visualização</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair da demo</span>
          </Link>
        </header>

        <DemoSidebarNav attentionBadge={attentionBadge} mobile />

        <main className="flex-1 bg-[var(--pb-bg)] px-4 py-6 md:px-8 md:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
