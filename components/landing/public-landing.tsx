"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { LogoMark } from "@/components/brand/logo";
import { MessageCircle, Send, Shield } from "lucide-react";

export type PublicOrgPayload = {
  id: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  titulo_landing: string;
  descricao_landing: string;
  ativo: boolean;
};

export function PublicLanding({ org, slug }: { org: PublicOrgPayload; slug: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const waReady = org.whatsapp_number.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!nome.trim() || !telefone.trim() || !interesse.trim()) {
      setErr("Preencha nome, telefone e interesse.");
      return;
    }
    if (!waReady) {
      setErr("Esta página ainda não tem WhatsApp configurado. Tente mais tarde.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc("public_submit_lead", {
        p_slug: slug,
        p_nome: nome.trim(),
        p_telefone: telefone.trim(),
        p_interesse: interesse.trim(),
        p_observacao: observacao.trim() || null,
      });

      if (error) {
        if (error.message.includes("validation_error")) {
          setErr("Preencha todos os campos obrigatórios.");
        } else if (error.message.includes("invalid_slug")) {
          setErr("Página não encontrada ou inativa.");
        } else {
          setErr(error.message);
        }
        return;
      }

      const msg = `Olá, meu nome é ${nome.trim()}. Tenho interesse em ${interesse.trim()}.${observacao.trim() ? ` Obs.: ${observacao.trim()}` : ""}`;
      const url = buildWhatsappUrl(org.whatsapp_number, msg);
      window.open(url, "_blank", "noopener,noreferrer");
      setNome("");
      setTelefone("");
      setInteresse("");
      setObservacao("");
    } catch {
      setErr("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050814] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-25%] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[360px] w-[480px] rounded-full bg-violet-600/15 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-lg px-5 py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <span className="text-sm font-semibold tracking-tight text-white">{org.name}</span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
            Contato
          </span>
        </div>

        <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl md:leading-tight">
          {org.titulo_landing}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-400 md:text-lg">{org.descricao_landing}</p>

        <form
          onSubmit={onSubmit}
          className="mt-12 rounded-3xl border border-white/10 bg-slate-950/70 p-1 shadow-lg shadow-black/25"
        >
          <div className="rounded-[1.4rem] bg-slate-950/90 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3 text-indigo-300">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">Envie seus dados — respondemos pelo WhatsApp</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nome completo *
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/15"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  WhatsApp / telefone *
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/15"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="DDD + número"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Serviço ou interesse *
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/15"
                  value={interesse}
                  onChange={(e) => setInteresse(e.target.value)}
                  placeholder="Ex.: orçamento de site para minha loja"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Observação (opcional)
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/15"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Detalhes extras, prazo, horário preferido…"
                />
              </div>
            </div>

            {err && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                {err}
              </p>
            )}

            {!waReady && (
              <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
                Esta empresa ainda não configurou o número do WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !waReady}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-45"
            >
              {loading ? (
                "Salvando…"
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Chamar no WhatsApp
                </>
              )}
            </button>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <p className="text-left text-[11px] leading-relaxed text-slate-500">
                Primeiro salvamos seu contato no painel da empresa; em seguida abrimos o WhatsApp com uma mensagem
                pronta. Não há leitura automática de conversas nem integração com API oficial do WhatsApp neste fluxo.
              </p>
            </div>
          </div>
        </form>

        <p className="mt-12 text-center text-[11px] text-slate-600">
          Página profissional com <span className="text-slate-400">PageBoost</span>
        </p>
      </div>
    </div>
  );
}
