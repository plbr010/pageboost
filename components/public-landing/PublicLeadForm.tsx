"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsappUrl, normalizeWhatsappDigits } from "@/lib/whatsapp";
import type { PublicOrgPayload } from "@/components/public-landing/types";
import { MessageCircle, Send, Shield } from "lucide-react";

type Variant = "simple" | "premium";

export function PublicLeadForm({ org, slug, variant }: { org: PublicOrgPayload; slug: string; variant: Variant }) {
  const supabase = useMemo(() => createClient(), []);
  const submittingRef = useRef(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const waReady = org.whatsapp_number.trim().length > 0;

  const inputBase =
    variant === "simple"
      ? "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      : "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/25";

  const labelCls =
    variant === "simple"
      ? "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
      : "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current || loading) return;
    setErr(null);

    const n = nome.trim();
    const tRaw = telefone.trim();
    const i = interesse.trim();
    const digits = normalizeWhatsappDigits(tRaw);

    if (!n || !tRaw || !i) {
      setErr("Preencha nome, telefone e interesse.");
      return;
    }
    if (!digits || digits.length < 10) {
      setErr("Informe um telefone válido com DDD (e DDI 55 se for Brasil).");
      return;
    }
    if (!waReady) {
      setErr("Esta página ainda não tem WhatsApp configurado. Tente mais tarde.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      const { error } = await supabase.rpc("public_submit_lead", {
        p_slug: slug,
        p_nome: n,
        p_telefone: digits,
        p_interesse: i,
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

      let msg = `Olá, meu nome é ${n}. Tenho interesse em ${i}.`;
      if (observacao.trim()) {
        msg += ` Obs.: ${observacao.trim()}`;
      }
      const url = buildWhatsappUrl(org.whatsapp_number, msg);
      window.open(url, "_blank", "noopener,noreferrer");
      setNome("");
      setTelefone("");
      setInteresse("");
      setObservacao("");
    } catch {
      setErr("Não foi possível salvar seu contato. Tente novamente.");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  const formShell =
    variant === "simple"
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      : "rounded-2xl border border-white/15 bg-slate-950/60 p-6 shadow-lg shadow-black/20 backdrop-blur-sm md:p-8";

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={formShell}>
      <div className={variant === "simple" ? "mb-5 flex items-center gap-2 text-indigo-600" : "mb-5 flex items-center gap-2 text-indigo-200"}>
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold leading-snug">
          Preencha seus dados para iniciar o atendimento pelo WhatsApp.
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Nome completo *</label>
          <input required className={inputBase} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como devemos te chamar?" />
        </div>
        <div>
          <label className={labelCls}>WhatsApp / telefone *</label>
          <input required className={inputBase} value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="DDD + número (com DDI se precisar)" />
        </div>
        <div>
          <label className={labelCls}>Serviço ou interesse *</label>
          <input required className={inputBase} value={interesse} onChange={(e) => setInteresse(e.target.value)} placeholder="Ex.: orçamento de site para minha loja" />
        </div>
        <div>
          <label className={labelCls}>Observação (opcional)</label>
          <textarea rows={3} className={`${inputBase} resize-none`} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Detalhes extras, prazo…" />
        </div>
      </div>

      {err && (
        <p
          className={
            variant === "simple"
              ? "mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              : "mt-4 rounded-xl border border-red-500/40 bg-red-950/60 px-4 py-3 text-sm text-red-100"
          }
          role="alert"
        >
          {err}
        </p>
      )}

      {!waReady && (
        <p
          className={
            variant === "simple"
              ? "mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              : "mt-4 rounded-xl border border-amber-500/35 bg-amber-950/50 px-4 py-3 text-sm text-amber-50"
          }
        >
          Esta empresa ainda não configurou o número do WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !waReady}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-900/15 transition hover:brightness-105 disabled:pointer-events-none disabled:opacity-45"
      >
        {loading ? (
          "Salvando seu contato…"
        ) : (
          <>
            <Send className="h-4 w-4 shrink-0" />
            Chamar no WhatsApp
          </>
        )}
      </button>

      <div
        className={
          variant === "simple"
            ? "mt-5 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            : "mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
        }
      >
        <Shield className={`mt-0.5 h-4 w-4 shrink-0 ${variant === "simple" ? "text-slate-400" : "text-slate-500"}`} />
        <p className={`text-left text-[11px] leading-relaxed ${variant === "simple" ? "text-slate-600" : "text-slate-400"}`}>
          Seus dados serão usados apenas para contato da empresa. Primeiro salvamos seu pedido; em seguida abrimos o
          WhatsApp com a mensagem pronta.
        </p>
      </div>
    </form>
  );
}
