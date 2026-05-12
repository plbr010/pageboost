"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsappUrl, normalizeWhatsappDigits } from "@/lib/whatsapp";
import type { PublicOrgPayload } from "@/components/public-landing/types";
import { MessageCircle, Send } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export function PublicLeadForm({ org, slug }: { org: PublicOrgPayload; slug: string }) {
  const supabase = useMemo(() => createClient(), []);
  const submittingRef = useRef(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const waReady = org.whatsapp_number.trim().length > 0;

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

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 md:p-8">
      <div className="mb-5 flex items-center gap-2 text-indigo-700">
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
        <span className="text-sm font-semibold leading-snug">Preencha para continuar no WhatsApp</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Nome *</label>
          <input required className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </div>
        <div>
          <label className={labelCls}>Telefone / WhatsApp *</label>
          <input
            required
            className={inputCls}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="DDD + número"
          />
        </div>
        <div>
          <label className={labelCls}>Interesse *</label>
          <input
            required
            className={inputCls}
            value={interesse}
            onChange={(e) => setInteresse(e.target.value)}
            placeholder="Ex.: orçamento de consulta"
          />
        </div>
        <div>
          <label className={labelCls}>Observação (opcional)</label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Detalhes extras…" />
        </div>
      </div>

      {err ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </p>
      ) : null}

      {!waReady ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Esta empresa ainda não configurou o número do WhatsApp.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !waReady}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          "Salvando…"
        ) : (
          <>
            <Send className="h-4 w-4 shrink-0" aria-hidden />
            Chamar no WhatsApp
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        Seus dados serão usados apenas para contato da empresa.
      </p>
    </form>
  );
}
