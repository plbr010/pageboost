/** Tamanho máximo do slug na URL pública */
export const ORG_SLUG_MAX_LENGTH = 48;

const RESERVED = new Set(["http", "https", "www", "l", "api", "admin", "null", "undefined"]);

/** Qualquer texto contendo `/l/segmento` — inclusive URL completa colada. */
function extractLPathSegment(s: string): string | null {
  const m = s.trim().match(/\/l\/([^/?#]+)/i);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/**
 * Normaliza texto para slug de organização: minúsculas, sem acentos, só [a-z0-9-].
 * Trata URLs coladas (com ou sem protocolo), extraindo `/l/segmento` ou o primeiro rótulo do host.
 */
export function normalizeOrgSlug(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const fromLandingPath = extractLPathSegment(trimmed);
  if (fromLandingPath) return finalizeSlug(fromLandingPath);

  const lowered = trimmed.toLowerCase();
  const looksLikeUrl =
    lowered.includes("://") ||
    lowered.startsWith("//") ||
    /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/|$)/i.test(trimmed);

  if (looksLikeUrl) {
    const extracted = extractSlugHintFromUrlLike(trimmed);
    if (extracted) return finalizeSlug(extracted);
  }

  return finalizeSlug(trimmed);
}

function extractSlugHintFromUrlLike(input: string): string | null {
  let u = input.trim();
  if (u.startsWith("//")) u = "https:" + u;
  else if (!/^https?:\/\//i.test(u) && /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}/i.test(u)) u = "https://" + u;

  try {
    const url = new URL(u);
    const path = (url.pathname || "/").replace(/\/+$/, "") || "/";
    const lm = path.match(/\/l\/([^/]+)/i);
    if (lm?.[1]) return decodeURIComponent(lm[1]);

    const host = url.hostname.toLowerCase();
    if (!host) return null;
    const parts = host.split(".").filter(Boolean);
    if (parts[0] === "www") parts.shift();
    if (parts.length === 0) return null;
    return parts[0] ?? null;
  } catch {
    return null;
  }
}

function finalizeSlug(segment: string): string {
  const s = slugifyCore(segment);
  if (!s) return "";
  if (RESERVED.has(s)) return "";
  return s;
}

function slugifyCore(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ORG_SLUG_MAX_LENGTH);
}

export function isValidOrgSlug(slug: string): boolean {
  if (!slug || slug.length > ORG_SLUG_MAX_LENGTH) return false;
  if (RESERVED.has(slug)) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
