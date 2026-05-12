import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config";

/**
 * Cliente Supabase sem cookies nem sessão do usuário.
 * Use em rotas públicas que dependem só de RPCs `security definer` (ex.: landing `/l/[slug]`).
 */
export function createPublicAnonClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    throw new Error("Supabase não configurado no .env.local");
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
