"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { LogoWordmark } from "@/components/brand/logo";
import { Check, LayoutGrid, Loader2, Bell } from "lucide-react";

const miniBenefits = [
  { icon: LayoutGrid, text: "Página pública para captar interessados" },
  { icon: Check, text: "Leads organizados no Kanban" },
  { icon: Bell, text: "Follow-up para não esquecer retornos" },
] as const;

export default function LoginClient({ next, error }: { next: string; error?: string }) {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  const supabase = useMemo(() => createClient(), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (mode === "register") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
            data: { full_name: fullName },
          },
        });
        if (err) throw err;
        setFeedback({
          kind: "info",
          text: "Conta criada. Se o e-mail pedir confirmação, abra a mensagem antes de entrar.",
        });
        setMode("login");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setFeedback({
        kind: "error",
        text: err instanceof Error ? err.message : "Não foi possível continuar",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[1fr_min(100%,480px)] xl:grid-cols-[1fr_520px]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0c1020] px-10 py-12 text-white lg:flex xl:px-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 0%, rgba(79,70,229,0.35) 0%, transparent 50%), radial-gradient(80% 60% at 100% 100%, rgba(91,33,182,0.25) 0%, transparent 45%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <Link href="/" className="inline-block pb-focus">
            <LogoWordmark size="md" variant="onDark" />
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">PageBoost</p>
          <h2 className="mt-3 max-w-md text-2xl font-semibold leading-snug tracking-tight xl:text-3xl">
            Organize seus leads antes que eles esfriem.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Uma página profissional para captar contatos, um painel com Kanban e alertas de follow-up quando a
            negociação para na mesma etapa.
          </p>
        </div>
        <ul className="relative space-y-4 pb-4">
          {miniBenefits.map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                <item.icon className="h-4 w-4 text-indigo-200" aria-hidden />
              </span>
              <span className="leading-snug">{item.text}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex pb-focus">
              <LogoWordmark size="md" variant="onLight" />
            </Link>
            <p className="mt-3 text-sm text-slate-600">Acesse seu painel e configure sua página pública.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors",
                  mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
                )}
                onClick={() => {
                  setMode("login");
                  setFeedback(null);
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors",
                  mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
                )}
                onClick={() => {
                  setMode("register");
                  setFeedback(null);
                }}
              >
                Criar conta
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {error === "config" && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  O sistema ainda não está configurado para login. Peça ao responsável pela conta para revisar as
                  variáveis de ambiente do projeto (URL e chave do Supabase).
                </p>
              )}
              {error === "auth" && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  Falha na autenticação. Tente de novo.
                </p>
              )}
              {feedback && (
                <p
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm",
                    feedback.kind === "error"
                      ? "border border-red-200 bg-red-50 text-red-900"
                      : "border border-slate-200 bg-slate-50 text-slate-800",
                  )}
                  role={feedback.kind === "error" ? "alert" : "status"}
                >
                  {feedback.text}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "register" && (
                <div>
                  <label className="pb-label">Nome</label>
                  <input
                    className="pb-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    required={mode === "register"}
                  />
                </div>
              )}
              <div>
                <label className="pb-label">E-mail</label>
                <input
                  type="email"
                  className="pb-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                />
              </div>
              <div>
                <label className="pb-label">Senha</label>
                <input
                  type="password"
                  className="pb-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="pb-btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3.5 text-[15px] font-semibold disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    Aguarde…
                  </>
                ) : mode === "register" ? (
                  "Criar conta"
                ) : (
                  "Entrar no painel"
                )}
              </button>
            </form>
          </div>

          <ul className="mt-8 space-y-3 border-t border-slate-200/80 pt-8 lg:hidden">
            {miniBenefits.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                {item.text}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/" className="font-medium text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline">
              ← Voltar ao site
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
