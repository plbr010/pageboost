import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { AppShell } from "@/components/app/app-shell";
import { fetchAttentionCount } from "@/lib/attention-count";

export default async function AppAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { organization, organizationId } = await ensureOrganization(supabase);
  let attentionCount = 0;
  try {
    attentionCount = await fetchAttentionCount(supabase, organizationId);
  } catch {
    attentionCount = 0;
  }

  return (
    <AppShell
      email={user.email ?? ""}
      orgName={organization?.name ?? "Minha empresa"}
      initialAttentionCount={attentionCount}
    >
      {children}
    </AppShell>
  );
}
