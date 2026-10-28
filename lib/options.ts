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

export function svgResponse(svg: string, cacheControl: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
