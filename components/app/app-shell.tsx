import Link from "next/link";
import { SignOutButton } from "@/components/app/sign-out-button";
import { MobileNavLinks, SidebarNavLinks } from "@/components/app/nav-links";
import { LogoWordmark } from "@/components/brand/logo";
import { AttentionProvider } from "@/components/app/attention-context";
import { PendingFollowupBanner } from "@/components/app/pending-followup-banner";

function SidebarAccountFooter({ email }: { email: string }) {
  const initial = email.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="border-t border-white/10 p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Conta</p>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-900/40"
          aria-hidden
        >
          {initial}
        </div>
        <p className="min-w-0 flex-1 truncate text-xs leading-snug text-slate-300" title={email}>
          {email}
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  email,
  orgName,
  initialAttentionCount,
}: {
  children: React.ReactNode;
  email: string;
  orgName: string;
  initialAttentionCount: number;
}) {
  return (
    <AttentionProvider initialCount={initialAttentionCount}>
      <div className="flex min-h-dvh items-start bg-[var(--pb-bg)] text-slate-900">
        <aside className="sticky top-0 z-30 hidden h-dvh max-h-dvh w-64 shrink-0 flex-col border-r border-white/10 bg-[var(--pb-sidebar)] md:flex">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-5">
            <Link href="/dashboard" className="pb-focus rounded-lg">
              <LogoWordmark size="sm" variant="onDark" />
            </Link>
          </div>
          <div className="shrink-0 border-b border-white/10 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Empresa</p>
            <p className="mt-1 truncate text-sm font-medium text-white" title={orgName}>
              {orgName}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <SidebarNavLinks />
          </div>
          <SidebarAccountFooter email={email} />
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <PendingFollowupBanner />
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/90 bg-white px-4 shadow-sm md:h-16 md:px-8">
            <div className="flex min-w-0 items-center gap-3 md:hidden">
              <Link href="/dashboard" className="pb-focus rounded-lg">
                <LogoWordmark size="sm" variant="onLight" />
              </Link>
            </div>
            <div className="hidden min-w-0 flex-1 md:block">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Painel</p>
              <p className="truncate text-sm font-semibold text-slate-900">{orgName}</p>
            </div>
            <SignOutButton />
          </header>

          <MobileNavLinks />

          <main className="flex-1 bg-[var(--pb-bg)] px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </AttentionProvider>
  );
}
