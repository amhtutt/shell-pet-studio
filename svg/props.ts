// Small props (mood extras, gifts, decorations), centred on (x, y) in the creature frame.
// Uses the cut-out sticker sheets when scripts/build-art.py found them, else simple drawn stand-ins.
import { ART } from "./art/assets";
import type { Sprite } from "./art/types";
import { FONT, GOLD, INK, sparklePath, starPath } from "./util";

export type PropName =
  | "question"
  | "papers"
  | "cloud"
  | "z"
  | "sparkle"
  | "sparks"
  | "nightcap"
  | "cobweb"
  | "leaf"
  | "giftShell"
  | "giftStar"
  | "confetti";

const SHEETS = ART;

const r1 = (n: number) => Math.round(n * 10) / 10;
const thin = (w = 2) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Place a sprite so its longer side is `size` units, centred on (x, y). */
function image(s: Sprite, x: number, y: number, size: number, cls = "", rot = 0): string {
  const k = size / Math.max(s.w, s.h);
  const w = r1(s.w * k);
  const h = r1(s.h * k);
  const img = `<image href="${s.src}" x="${r1(-w / 2)}" y="${r1(-h / 2)}" width="${w}" height="${h}"/>`;
  return place(cls ? `<g class="${cls}">${img}</g>` : img, x, y, rot);
}

function place(inner: string, x: number, y: number, rot = 0): string {
  return `<g transform="translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ""}">${inner}</g>`;
}

const text = (ch: string) => (s: number) =>
  `<text y="${r1(s * 0.36)}" text-anchor="middle" font-family="${FONT}" font-size="${s}" font-weight="800" fill="${INK}">${ch}</text>`;

const DRAWN: Record<PropName, (size: number) => string> = {
  question: text("?"),
  z: text("z"),
  sparkle: (s) => `<path d="${sparklePath(s / 2)}" fill="${GOLD}"/>`,
  sparks: (s) =>
    `<path d="M${r1(-s * 0.4)} 0l${r1(s * 0.2)} ${r1(-s * 0.2)}M0 ${r1(-s * 0.1)}V${r1(-s * 0.45)}M${r1(s * 0.4)} 0l${r1(-s * 0.2)} ${r1(-s * 0.2)}" fill="none" stroke="${GOLD}" stroke-width="${r1(s * 0.14)}" stroke-linecap="round"/>`,
  cloud: (s) =>
    `<g fill="#DCE8F2" ${thin()}><circle cx="${r1(-s * 0.25)}" r="${r1(s * 0.22)}"/><circle cy="${r1(-s * 0.1)}" r="${r1(s * 0.28)}"/><circle cx="${r1(s * 0.26)}" r="${r1(s * 0.22)}"/></g>`,
  papers: (s) =>
    [0.3, 0.1, -0.1, -0.3]
      .map(
        (t, i) =>
          `<rect x="${r1(-s / 2)}" y="${r1(t * s - s * 0.08)}" width="${s}" height="${r1(s * 0.16)}" rx="2" fill="#FBF6EC" ${thin()} transform="rotate(${i % 2 ? 3 : -3})"/>`,
      )
      .join(""),
  nightcap: (s) =>
    `<path d="M${r1(-s / 2)} ${r1(-s * 0.3)}Q${r1(s * 0.3)} ${r1(-s * 0.3)} ${r1(s * 0.4)} ${r1(s * 0.2)}L${r1(-s / 2)} ${r1(s * 0.25)}Z" fill="#9CC8EE" ${thin(2.5)}/><circle cx="${r1(s * 0.42)}" cy="${r1(s * 0.24)}" r="${r1(s * 0.12)}" fill="#fff" ${thin(2)}/>`,
  cobweb: (s) =>
    `<path d="M0 ${r1(-s / 2)}V${r1(s / 2)}M${r1(-s / 2)} 0H${r1(s / 2)}M${r1(-s * 0.35)} ${r1(-s * 0.35)}L${r1(s * 0.35)} ${r1(s * 0.35)}M${r1(s * 0.35)} ${r1(-s * 0.35)}L${r1(-s * 0.35)} ${r1(s * 0.35)}" fill="none" stroke="#F4F1EC" stroke-width="1.4"/><circle r="${r1(s * 0.22)}" fill="none" stroke="#F4F1EC" stroke-width="1.4"/>`,
  leaf: (s) => `<path d="M${r1(-s / 2)} 0Q0 ${r1(-s * 0.4)} ${r1(s / 2)} 0Q0 ${r1(s * 0.4)} ${r1(-s / 2)} 0Z" fill="#C08A4E" ${thin()}/>`,
  giftShell: (s) => `<path d="M${r1(-s / 2)} ${r1(s * 0.2)}Q0 ${r1(-s * 0.7)} ${r1(s / 2)} ${r1(s * 0.2)}Z" fill="#F7E7D2" ${thin()}/>`,
  giftStar: (s) => `<path d="${starPath(s / 2)}" fill="${GOLD}" ${thin()}/>`,
  confetti: (s) =>
    `<rect x="${r1(-s * 0.2)}" y="${r1(-s * 0.35)}" width="${r1(s * 0.4)}" height="${r1(s * 0.7)}" rx="1.5" fill="#F28AB2"/>`,
};

export function prop(name: PropName, x: number, y: number, size: number, cls = "", rot = 0): string {
  const s = SHEETS.props?.[name];
  if (s) return image(s, x, y, size, cls, rot);
  return place(cls ? `<g class="${cls}">${DRAWN[name](size)}</g>` : DRAWN[name](size), x, y, rot);
}

const DECO_FALLBACK: Record<string, (s: number) => string> = {
  barnacle: (s) => `<circle r="${r1(s / 2)}" fill="#FFFDF7" ${thin()}/><circle r="${r1(s * 0.16)}" fill="${INK}"/>`,
  star: (s) => `<path d="${starPath(s / 2)}" fill="#F27C97" ${thin(1.6)}/>`,
  flower: (s) => `<circle r="${r1(s / 2)}" fill="#F59BB5" ${thin()}/><circle r="${r1(s * 0.18)}" fill="#FFE08A"/>`,
  flower2: (s) => `<circle r="${r1(s / 2)}" fill="#B79BE6" ${thin()}/><circle r="${r1(s * 0.18)}" fill="#FFE08A"/>`,
  heart: (s) =>
    `<path transform="scale(${r1(s / 14)})" d="M0 5C-8 -1 -7 -8 -3 -8C-1 -8 0 -6.5 0 -5.5C0 -6.5 1 -8 3 -8C7 -8 8 -1 0 5Z" fill="#7DB8F0" ${thin(1.4)}/>`,
  pebble: (s) => `<ellipse rx="${r1(s / 2)}" ry="${r1(s * 0.38)}" fill="#B9B3AB" ${thin()}/>`,
};

/** A shell decoration (one per contributor). Flowers alternate between pink and lilac. */
export function decoration(kind: string, x: number, y: number, i: number, size = 15): string {
  const key = kind === "flower" && i % 2 ? "flower2" : kind;
  const s = SHEETS.decorations?.[key];
  const inner = s ? image(s, 0, 0, size) : (DECO_FALLBACK[key] ?? DECO_FALLBACK.pebble)(size);
  return `<g class="sp-deco">${place(inner, x, y)}</g>`;
}
