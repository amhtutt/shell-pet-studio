import type { Layout, RenderOptions, Size } from "@/svg/render";
import type { Theme } from "@/svg/styles";

const oneOf = <T extends string>(v: string | null, allowed: readonly T[], fallback: T): T =>
  v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

export function parseOptions(params: URLSearchParams): RenderOptions {
  return {
    layout: oneOf<Layout>(params.get("layout"), ["wide", "square"], "wide"),
    theme: oneOf<Theme>(params.get("theme"), ["auto", "light", "dark"], "auto"),
    size: oneOf<Size>(params.get("size"), ["sm", "md", "lg"], "md"),
  };
}

export interface PetInfo {
  status: "ok" | "missing" | "unavailable";
  reason?: string;
  fetchedAt?: string;
}

/** Badges are public images; any site may load them and read the pet headers. */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers": "X-Shell-Pet-Status, X-Shell-Pet-Reason, X-Shell-Pet-Fetched-At",
  "Access-Control-Max-Age": "86400",
};

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function svgResponse(svg: string, cacheControl: string, info?: PetInfo): Response {
  const headers: Record<string, string> = {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": cacheControl,
    "X-Content-Type-Options": "nosniff",
    ...CORS_HEADERS,
  };
  if (info) {
    headers["X-Shell-Pet-Status"] = info.status;
    if (info.reason) headers["X-Shell-Pet-Reason"] = info.reason.replace(/[^\x20-\x7e]/g, "");
    if (info.fetchedAt) headers["X-Shell-Pet-Fetched-At"] = info.fetchedAt;
  }
  return new Response(svg, { headers });
}
