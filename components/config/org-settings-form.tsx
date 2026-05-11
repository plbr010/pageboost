"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrgLandingLayout, OrgRow } from "@/lib/types";
import { getPublicBaseUrlClient } from "@/lib/url-client";
import { isValidOrgSlug, normalizeOrgSlug } from "@/lib/slug";
import { cn } from "@/lib/cn";
import { Building2, Check, Copy, ExternalLink, Globe, LayoutTemplate, MessageCircle, Sparkles } from "lucide-react";

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

  const initialLayout: OrgLandingLayout = organization.landing_layout === "premium" ? "premium" : "simple";

  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [whatsapp, setWhatsapp] = useState(organization.whatsapp_number);
  const [titulo, setTitulo] = useState(organization.titulo_landing);
  const [descricao, setDescricao] = useState(organization.descricao_landing);
  const [ativo, setAtivo] = useState(organization.ativo);
  const [landingLayout, setLandingLayout] = useState<OrgLandingLayout>(initialLayout);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const previewBase = getPublicBaseUrlClient();
  const normalizedPreviewSlug = normalizeOrgSlug(slug) || slug;
  const publicUrl = `${previewBase}/l/${normalizedPreviewSlug}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const nextSlug = normalizeOrgSlug(slug);
      if (!nextSlug) {
        throw new Error("Informe um endereço para a página. Use apenas letras minúsculas, números e hífen (ex.: minha-empresa).");
      }
      if (!isValidOrgSlug(nextSlug)) {
        throw new Error(
          "Endereço inválido ou reservado. Use um nome curto (ex.: minha-empresa). Se colou um link completo, salvamos só o trecho final do endereço.",
        );
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
          landing_layout: landingLayout,
        })
        .eq("id", organization.id);
      if (error) {
        if (error.code === "23505" || error.message.includes("unique") || error.message.includes("duplicate")) {
          throw new Error("Este endereço já está em uso. Escolha outro slug.");
        }
        throw error;
      }
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

      <section className="pb-card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Link público da página</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
                Sua página pública é onde o cliente preenche nome, telefone e interesse antes de abrir o WhatsApp.
                Copie esse link e coloque na bio do Instagram, anúncio, cartão digital ou envie no direct.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Seu link</p>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-3">
            <p className="min-w-0 flex-1 break-all font-mono text-sm font-medium text-slate-800">{publicUrl}</p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <CopyLinkButton url={publicUrl} />
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/80"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir página pública
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Página ativa para receber leads</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                Desative se quiser pausar temporariamente a entrada de novos leads pela página.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-8">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Aparência da página pública</h3>
              <p className="mt-1 text-sm text-slate-600">
                Escolha como sua página pública será exibida para os clientes que vão preencher os dados antes de chamar
                no WhatsApp.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLandingLayout("simple")}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition",
                landingLayout === "simple"
                  ? "border-indigo-500 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-200/60"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simples</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Direto ao ponto</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Formulário em destaque. Ideal para captar leads rápido.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setLandingLayout("premium")}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition",
                landingLayout === "premium"
                  ? "border-indigo-500 bg-indigo-50/80 shadow-sm ring-2 ring-indigo-200/60"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Premium</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Visual mais elaborado</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Benefícios e seções extras com aparência mais profissional.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Prévia da página pública</p>
          <p className="mt-3 text-lg font-semibold leading-snug text-slate-900">{titulo || "Título da página"}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {descricao || "Descrição curta aparecerá aqui."}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Layout escolhido: <strong className="text-slate-700">{landingLayout === "premium" ? "Premium" : "Simples"}</strong>
          </p>
          <div className="mt-4 h-2 w-24 rounded-full bg-slate-200" aria-hidden />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="pb-label">Título da página pública</label>
            <input className="pb-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            <p className="mt-1.5 text-xs text-slate-500">Frase principal no topo da página que o cliente vê.</p>
          </div>
          <div className="sm:col-span-2">
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
        </div>
      </section>

      <section className="pb-card p-6 md:p-8">
        <div className="flex gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Empresa e WhatsApp</h2>
            <p className="mt-1 text-sm text-slate-600">
              Nome exibido na página, endereço do link e número (com DDI) para onde o botão leva após o envio do
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
              onBlur={() => {
                const n = normalizeOrgSlug(slug);
                if (n) setSlug(n);
              }}
              required
            />
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Use apenas o nome da empresa ou campanha. <strong className="font-medium text-slate-800">Exemplo:</strong>{" "}
              <span className="font-mono text-slate-700">minha-empresa</span>. Se colar um link, ajustamos automaticamente
              para o trecho correto ao sair do campo ou ao salvar.
            </p>
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
