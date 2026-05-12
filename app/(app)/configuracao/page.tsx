import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { OrgSettingsForm } from "@/components/config/org-settings-form";
import type { OrgRow } from "@/lib/types";
import { Settings2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfiguracaoPage() {
  const supabase = await createClient();
  const { organizationId, organization } = await ensureOrganization(supabase);

  if (!organization) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Não foi possível carregar a organização ({organizationId}).
      </div>
    );
  }

  const settingsFormKey = [
    organization.slug,
    organization.name,
    organization.whatsapp_number,
    organization.titulo_landing,
    organization.descricao_landing,
    String(organization.ativo),
  ].join("|");

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
            <Settings2 className="h-3.5 w-3.5 text-indigo-600" />
            Configurações
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Sua empresa e página pública</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Aqui você edita o link que divulga, o texto da landing e o WhatsApp. Leads criados pelo formulário da página
            ou manualmente no painel aparecem no Kanban.
          </p>
        </div>
      </div>
      <OrgSettingsForm key={settingsFormKey} organization={organization as OrgRow} />
    </div>
  );
}
