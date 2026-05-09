/** Base pública no browser (fallback localhost). */
export function getPublicBaseUrlClient() {
  if (typeof window === "undefined") return "";
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (env) return env;
  return window.location.origin;
}
