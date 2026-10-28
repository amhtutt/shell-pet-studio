// Crab body parts in the creature frame (ground at y=150, shell aperture anchor at 128,130).
// Split into layers so the shell can sit between the body and the front claw/eyes.
import type { Mood } from "@/lib/mood";
import type { Traits } from "@/lib/traits";
import { CHEEK, INK, SW } from "./util";

export interface CrabPalette {
  base: string;
  shadow: string;
}

export type EyeKind = "open" | "happy" | "wide" | "droopy" | "worried";

export interface CrabOptions {
  traits: Traits;
  palette: CrabPalette;
  mood: Mood;
  /** Multiplier for eyeball size (hatchlings get big eyes). */
  eyeScale?: number;
  /** Item held in front of the body, drawn under the big claw. */
  held?: string;
}

export interface CrabLayers {
  back: string;
  body: string;
  front: string;
}

const STROKE = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
const BODY = { cx: 142, cy: 116, rx: 38, ry: 29 };
const STALK_LENGTH = { short: 0.74, medium: 1, long: 1.22 } as const;

const STALKS: { base: [number, number]; tip: [number, number] }[] = [
  { base: [150, 96], tip: [154, 58] },
  { base: [163, 99], tip: [178, 65] },
];

function leg(bx: number, by: number, dx: number, dy: number, w: number, fill: string): string {
  return `<path d="M${bx - w} ${by}Q${bx - w + dx * 0.4} ${by + dy * 0.7} ${bx + dx} ${by + dy}Q${bx + w + dx * 0.6} ${by + dy * 0.3} ${bx + w} ${by}Z" fill="${fill}" ${STROKE}/>`;
}

function claw(x: number, y: number, s: number, rot: number, fill: string): string {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s.toFixed(3)})">` +
    `<ellipse rx="18" ry="15" fill="${fill}" ${STROKE}/>` +
    `<path d="M-3 -3Q9 -3 16 6" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/></g>`
  );
}

function stalkTip(i: number, traits: Traits, mood: Mood): [number, number] {
  const { base, tip } = STALKS[i];
  const len = STALK_LENGTH[traits.eyeStalk];
  let dx = (tip[0] - base[0]) * len;
  let dy = (tip[1] - base[1]) * len;
  if (mood === "sleepy" || mood === "lonely") {
    // Droop the stalks forward ~28°.
    const a = (28 * Math.PI) / 180;
    [dx, dy] = [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];
  }
  return [+(base[0] + dx).toFixed(1), +(base[1] + dy).toFixed(1)];
}

export function eyeKindFor(mood: Mood): EyeKind {
  switch (mood) {
    case "happy":
    case "celebrating":
      return "happy";
    case "curious":
      return "wide";
    case "sleepy":
    case "lonely":
      return "droopy";
    case "anxious":
      return "worried";
    default:
      return "open";
  }
}

function eye(kind: EyeKind, r: number, base: string): string {
  const pupil = `<circle r="${r}" fill="${INK}"/><circle cx="${(r * 0.32).toFixed(1)}" cy="${(-r * 0.34).toFixed(1)}" r="${(r * 0.32).toFixed(1)}" fill="#FFFFFF"/>`;
  switch (kind) {
    case "open":
      return `<g class="sp-blink">${pupil}</g>`;
    case "worried":
      return (
        `<g class="sp-blink">${pupil}</g>` +
        `<path d="M${-r} ${(-r * 1.55).toFixed(1)}L${(r * 0.8).toFixed(1)} ${(-r * 1.2).toFixed(1)}" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
      );
    case "happy":
      return (
        `<circle r="${r}" fill="${base}" stroke="${INK}" stroke-width="3.4"/>` +
        `<path d="M${(-r * 0.6).toFixed(1)} ${(r * 0.25).toFixed(1)}Q0 ${(-r * 0.8).toFixed(1)} ${(r * 0.6).toFixed(1)} ${(r * 0.25).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
      );
    case "wide": {
      const R = r * 1.25;
      return (
        `<circle r="${R.toFixed(1)}" fill="#FFFFFF" stroke="${INK}" stroke-width="3.4"/>` +
        `<circle cx="${(r * 0.2).toFixed(1)}" r="${(r * 0.62).toFixed(1)}" fill="${INK}"/>` +
        `<circle cx="${(r * 0.42).toFixed(1)}" cy="${(-r * 0.25).toFixed(1)}" r="${(r * 0.22).toFixed(1)}" fill="#FFFFFF"/>`
      );
    }
    case "droopy": {
      const R = r + 1;
      return (
        pupil +
        `<path d="M${-R} ${(-r * 0.05).toFixed(1)}A${R} ${R} 0 0 1 ${R} ${(-r * 0.05).toFixed(1)}Z" fill="${base}" stroke="${INK}" stroke-width="3"/>`
      );
    }
  }
}

function mouth(mood: Mood): string {
  const line = (d: string) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  switch (mood) {
    case "celebrating":
      return `<path d="M160 107Q166 119 172 107Z" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case "anxious":
      return line("M160 111q3 -3 6 0q3 3 6 0");
    case "curious":
      return `<circle cx="167" cy="110" r="2.8" fill="${INK}"/>`;
    case "lonely":
      return line("M161 113Q166 108 171 113");
    case "sleepy":
      return line("M162 111L169 111");
    default:
      return line("M161 108Q166 114 171 108");
  }
}

function pattern(traits: Traits, shadow: string): string {
  switch (traits.pattern) {
    case "spots":
      return `<circle cx="146" cy="130" r="3.8" fill="${shadow}"/><circle cx="158" cy="134" r="2.8" fill="${shadow}"/><circle cx="140" cy="120" r="2.8" fill="${shadow}"/>`;
    case "stripes":
      return `<path d="M141 90Q149 116 141 146M151 92Q159 118 151 146" fill="none" stroke="${shadow}" stroke-width="4"/>`;
    case "freckles":
      return `<circle cx="167" cy="101" r="1.4" fill="${shadow}"/><circle cx="170" cy="104" r="1.4" fill="${shadow}"/><circle cx="165" cy="105" r="1.4" fill="${shadow}"/>`;
    case "none":
      return "";
  }
}

export function crab(o: CrabOptions): CrabLayers {
  const { traits, palette, mood } = o;
  const { base, shadow } = palette;
  const big = 0.85 * Math.sqrt(traits.clawRatio);
  const small = 0.85 / Math.sqrt(traits.clawRatio);
  const r = 8 * (o.eyeScale ?? 1);
  const tips = [stalkTip(0, traits, mood), stalkTip(1, traits, mood)];

  const legs =
    leg(112, 130, -20, 20, 8.5, shadow) +
    leg(124, 138, -12, 15, 8.5, shadow) +
    leg(148, 141, 4, 12, 8.5, base) +
    leg(163, 137, 16, 15, 8.5, base);

  const stalks = STALKS.map(({ base: [bx, by] }, i) => {
    const [tx, ty] = tips[i];
    const d = `M${bx} ${by}L${tx} ${ty}`;
    return (
      `<path d="${d}" stroke="${INK}" stroke-width="${SW * 2 + 4}" stroke-linecap="round"/>` +
      `<path d="${d}" stroke="${base}" stroke-width="5" stroke-linecap="round"/>`
    );
  }).join("");

  const back = legs + claw(192, 102, small, -24, shadow) + stalks;

  const body =
    `<defs><clipPath id="sp-body"><ellipse cx="${BODY.cx}" cy="${BODY.cy}" rx="${BODY.rx}" ry="${BODY.ry}"/></clipPath></defs>` +
    `<ellipse cx="${BODY.cx}" cy="${BODY.cy}" rx="${BODY.rx}" ry="${BODY.ry}" fill="${base}"/>` +
    `<g clip-path="url(#sp-body)"><ellipse cx="${BODY.cx}" cy="${BODY.cy + 20}" rx="${BODY.rx + 6}" ry="12" fill="${shadow}"/>${pattern(traits, shadow)}</g>` +
    `<ellipse cx="${BODY.cx}" cy="${BODY.cy}" rx="${BODY.rx}" ry="${BODY.ry}" fill="none" ${STROKE}/>` +
    `<circle cx="160" cy="105" r="${mood === "grateful" ? 7.5 : 5.5}" fill="${CHEEK}"/>` +
    mouth(mood);

  const eyes = tips
    .map(([x, y]) => `<g transform="translate(${x} ${y})">${eye(eyeKindFor(mood), r, base)}</g>`)
    .join("");

  const front = (o.held ?? "") + claw(180, 130, big, 0, base) + eyes;
  return { back, body, front };
}
