/**
 * URL do projeto (Settings → API → Project URL).
 */
export function getSupabaseUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return u ? u.replace(/\/$/, "") : undefined;
}

/**
 * Chave pública do front: nova `sb_publishable_...` ou legada `anon` (JWT).
 * Nunca use `sb_secret_` / service_role no browser ou em NEXT_PUBLIC_*.
 */
export function getSupabasePublishableKey(): string | undefined {
  const a =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return a || undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}
