"use client";

import { useCallback, useState } from "react";
import { PIPELINE_STATUSES, STATUS_LABELS } from "@/lib/status";
import type { LeadRow, LeadStatus } from "@/lib/types";
import { DEMO_ORG_ID } from "@/lib/demo-audit-data";
import { X } from "lucide-react";

type OrigemUi = "manual" | "site";

function toOrigem(ui: OrigemUi): string {
  return ui === "site" ? "landing_page" : "manual";
}

export function DemoNewLeadModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (lead: LeadRow) => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState<LeadStatus>("novo");
  const [origemUi, setOrigemUi] = useState<OrigemUi>("manual");
  const [err, setErr] = useState<string | null>(null);

  const reset = useCallback(() => {
    setNome("");
    setTelefone("");
    setInteresse("");
    setObservacao("");
    setStatus("novo");
    setOrigemUi("manual");
    setErr(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  if (!open) return null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!nome.trim() || !telefone.trim() || !interesse.trim()) {
      setErr("Preencha nome, telefone e interesse.");
      return;
    }
    const now = new Date().toISOString();
    const lead: LeadRow = {
      id: `demo-local-${crypto.randomUUID()}`,
      organization_id: DEMO_ORG_ID,
      nome: nome.trim(),
      telefone: telefone.trim(),
      interesse: interesse.trim(),
      observacao: observacao.trim() ? observacao.trim() : null,
      status,
      origem: toOrigem(origemUi),
      status_updated_at: now,
      created_at: now,
      updated_at: now,
    };
    onAdd(lead);
    reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Fechar"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-new-lead-title"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-h-[85dvh] sm:rounded-2xl"
      >
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="demo-new-lead-title" className="text-lg font-bold tracking-tight text-slate-900">
                Novo lead
              </h2>
              <p className="mt-1 text-sm text-amber-800/90">
                Demonstração — o lead é adicionado só nesta página (memória do navegador), sem banco de dados.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden sm:max-h-[min(70dvh,640px)]">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            {err && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{err}</p>
            )}

            <div>
              <label className="pb-label">Nome</label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="pb-input"
                placeholder="Nome do contato"
              />
            </div>
            <div>
              <label className="pb-label">Telefone</label>
              <input
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="pb-input font-mono text-sm"
                placeholder="5511999998888"
              />
              <p className="mt-1 text-xs text-slate-500">Formato fictício para a demo.</p>
            </div>
            <div>
              <label className="pb-label">Interesse</label>
              <textarea
                required
                rows={2}
                value={interesse}
                onChange={(e) => setInteresse(e.target.value)}
                className="pb-input resize-none"
                placeholder="O que a pessoa quer orçar ou saber"
              />
            </div>
            <div>
              <label className="pb-label">Observação (opcional)</label>
              <textarea
                rows={2}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="pb-input resize-none"
                placeholder="Detalhes extras"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="pb-label">Etapa inicial</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="pb-input cursor-pointer bg-white py-2.5"
                >
                  {PIPELINE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pb-label">Origem</label>
                <select
                  value={origemUi}
                  onChange={(e) => setOrigemUi(e.target.value as OrigemUi)}
                  className="pb-input cursor-pointer bg-white py-2.5"
                >
                  <option value="manual">Manual</option>
                  <option value="site">Site</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/90 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button type="submit" className="pb-btn-primary px-6 py-2.5">
              Adicionar (só na demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
