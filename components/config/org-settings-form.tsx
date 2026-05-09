"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrgRow } from "@/lib/types";
import { getPublicBaseUrlClient } from "@/lib/url-client";
import { Building2, Check, Copy, Globe, MessageCircle, Sparkles } from "lucide-react";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function CopyLinkButton({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  }
  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
    >
      {state === "copied" ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar link
        </>
      )}
    </button>
  );
}

export function OrgSettingsForm({ organization }: { organization: OrgRow }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [whatsapp, setWhatsapp] = useState(organization.whatsapp_number);
  const [titulo, setTitulo] = useState(organization.titulo_landing);
  const [descricao, setDescricao] = useState(organization.descricao_landing);
  const [ativo, setAtivo] = useState(organization.ativo);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const previewBase = getPublicBaseUrlClient();
  const publicUrl = `${previewBase}/l/${slug}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const nextSlug = slugify(slug);
      if (!nextSlug) {
        throw new Error("Endereço da página inválido. Use letras, números e hífens.");
      }
      const { error } = await supabase
        .from("organizations")
        .update({
          name: name.trim(),
          slug: nextSlug,
          whatsapp_number: whatsapp.trim(),
          titulo_landing: titulo.trim(),
          descricao_landing: descricao.trim(),
          ativo,
        })
        .eq("id", organization.id);
      if (error) throw error;
      setSlug(nextSlug);
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não foi possível salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {msg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {msg}
        </div>
      )}

      {/* Sua página pública */}
      <section className="pb-card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Sua página pública</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
                É a página que o cliente abre, preenche e envia antes de ir para o WhatsApp. O link abaixo é o que você
                divulga (Instagram, cartão, QR code).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Link público</p>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-all font-mono text-sm font-medium text-slate-800">{publicUrl}</p>
            <CopyLinkButton url={publicUrl} />
          </div>
          <p className="text-xs text-slate-500">
            Em produção, defina{" "}
            <code className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[11px]">
              NEXT_PUBLIC_APP_URL
            </code>{" "}
            para o domínio certo aparecer aqui.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-5 shadow-inner">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prévia do que o visitante vê</p>
          <p className="mt-3 text-lg font-semibold leading-snug text-slate-900">{titulo || "Título da página"}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {descricao || "Descrição curta aparecerá aqui."}
          </p>
          <div className="mt-4 h-2 w-24 rounded-full bg-slate-200" aria-hidden />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="pb-label">Título na página</label>
            <input
              className="pb-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">Principal frase no topo da página pública.</p>
          </div>
          <div>
            <label className="pb-label">Descrição</label>
            <textarea
              rows={4}
              className="pb-input resize-none leading-relaxed"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">Texto de apoio logo abaixo do título.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">Página no ar</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                  Desativar pausa o formulário: visitantes não enviam novos leads até você ligar de novo.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Empresa e WhatsApp */}
      <section className="pb-card p-6 md:p-8">
        <div className="flex gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Empresa e WhatsApp</h2>
            <p className="mt-1 text-sm text-slate-600">
              Nome interno, endereço da URL e número (com DDI) para onde o botão de WhatsApp aponta após o envio do
              formulário.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="pb-label flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Nome da empresa
            </label>
            <input className="pb-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="pb-label">Endereço da página (slug)</label>
            <input
              className="pb-input font-mono text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">Só letras minúsculas, números e hífen. Aparece no link após /l/</p>
          </div>
          <div>
            <label className="pb-label flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              WhatsApp (com DDI)
            </label>
            <input
              className="pb-input font-mono text-sm"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="5511999998888"
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">Sem espaços ou símbolos. Ex.: 5511999998888</p>
          </div>
        </div>
      </section>

      <button type="submit" disabled={loading} className="pb-btn-primary w-full py-3.5 sm:w-auto sm:min-w-[200px]">
        {loading ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}
