import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganization } from "@/lib/org";
import { fetchAttentionCount } from "@/lib/attention-count";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const { organizationId } = await ensureOrganization(supabase);
    const count = await fetchAttentionCount(supabase, organizationId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
