import { languageShell, linguistColor } from "@/lib/languages";
import { moodLabel, type Mood } from "@/lib/mood";
import { shellScale, stageLabel, type Stage } from "@/lib/stage";
import { BODY_COLORS, bodyPalette, type Traits } from "@/lib/traits";
import { crab } from "./crab";
import {
  confetti,
  decoration,
  dryLeaves,
  emptyAperture,
  gift,
  heldPebble,
  heldStar,
  nightcap,
  questionMark,
  sighCloud,
  sparkles,
  sparks,
  sweatAndPapers,
  zzz,
} from "./props";
import { backdrop, border, frame, WIDE } from "./scene";
import { shellArt, type ShellPalette } from "./shells";
import { crackingEgg, egg, sandPatch } from "./stages";
import { styles, type Theme } from "./styles";
import { FONT, GOLD, esc, starPath } from "./util";

export type Layout = "wide" | "square";
export type Size = "sm" | "md" | "lg";

export interface RenderOptions {
  layout: Layout;
  theme: Theme;
  size: Size;
}

export interface PetState {
  owner: string;
  repo: string;
  traits: Traits;
  stage: Stage;
  mood: Mood;
  language: string | null;
  stars: number;
  contributors: number;
  majorReleases: number;
  /** A star arrived in the last 72h. */
  recentStar: boolean;
}

export const DEFAULT_OPTIONS: RenderOptions = { layout: "wide", theme: "auto", size: "md" };

const SIZES: Record<Layout, Record<Size, [number, number]>> = {
  wide: { sm: [360, 90], md: [480, 120], lg: [640, 160] },
  square: { sm: [96, 96], md: [160, 160], lg: [240, 240] },
};

const ANCHOR: [number, number] = [128, 130];
const GROUND: [number, number] = [142, 150];
const CRAB_SCALE: Partial<Record<Stage, number>> = { hatchling: 0.72, juvenile: 0.86, adult: 1, elder: 1.04 };
const PEARL: ShellPalette = { base: "#FBF8F2", shadow: "#EAE3D6", band: "#EDBB52" };
const CREAM = { base: "#F7EFE2", shadow: "#E8DCC8" };

const scaleAround = ([x, y]: [number, number], s: number) =>
  `transform="translate(${x} ${y}) scale(${+s.toFixed(3)}) translate(${-x} ${-y})"`;

function shellPalette(state: PetState): ShellPalette {
  if (state.traits.shiny) return PEARL;
  const band = linguistColor(state.language) ?? BODY_COLORS[state.traits.bodyColor].band;
  return { ...CREAM, band };
}

function decorationCount(stage: Stage, contributors: number): number {
  if (stage === "juvenile") return Math.min(contributors, 3);
  if (stage === "adult" || stage === "elder" || stage === "abandoned") return Math.min(contributors, 8);
  return 0;
}

function shellGroup(state: PetState, scale: number, extra = ""): string {
  const art = shellArt(languageShell(state.language), state.traits.genericShell, shellPalette(state));
  const n = decorationCount(state.stage, state.contributors);
  const decos = art.slots
    .slice(0, n)
    .map(([x, y], i) => decoration(state.traits.decorations[i], x, y, i, state.traits.shiny))
    .join("");
  return `<g transform="translate(${ANCHOR[0]} ${ANCHOR[1]}) scale(${scale})">${art.svg}${decos}${extra}</g>`;
}

function moodProps(mood: Mood): string {
  switch (mood) {
    case "celebrating":
      return confetti();
    case "anxious":
      return sweatAndPapers();
    case "curious":
      return questionMark();
    case "happy":
      return sparks();
    case "lonely":
      return sighCloud();
    case "sleepy":
      return zzz([
        [190, 66, 14],
        [204, 48, 19],
      ]);
    default:
      return "";
  }
}

const SHINY_SPARKLES: [number, number, number][] = [
  [30, 34, 11],
  [196, 36, 9],
  [212, 104, 8],
];
const ELDER_SPARKLES: [number, number, number][] = [
  [14, 60, 9],
  [70, 6, 8],
  [200, 48, 10],
  [214, 120, 7],
];

/** The creature in its own frame: x ≈ -10..220, ground at y=150. */
export function creature(state: PetState): string {
  const { traits, stage, mood } = state;
  const palette = bodyPalette(traits);

  const gifts =
    state.recentStar && stage !== "egg"
      ? traits.gifts
          .slice(0, traits.giftCount)
          .map((k, i) => gift(k, i ? 60 : 34, i ? 158 : 154))
          .join("")
      : "";
  const shine = traits.shiny ? sparkles(SHINY_SPARKLES) : "";

  if (stage === "egg") return sandPatch() + `<g class="sp-bob">${egg()}</g>` + shine;
  if (stage === "cracking") return sandPatch() + `<g class="sp-bob">${crackingEgg(palette)}</g>` + gifts + shine;

  if (stage === "abandoned") {
    const s = shellScale(stage, state.stars, state.majorReleases);
    return (
      `<g filter="url(#sp-fade)" opacity=".82">${shellGroup(state, s, emptyAperture())}</g>` + dryLeaves() + gifts
    );
  }

  if (mood === "sleeping") {
    const s = shellScale(stage, state.stars, state.majorReleases) || 0.8;
    return (
      `<g class="sp-bob">${shellGroup(state, s, nightcap())}</g>` +
      zzz([
        [170, 74, 14],
        [184, 56, 18],
        [198, 36, 23],
      ]) +
      gifts +
      shine
    );
  }

  const cs = CRAB_SCALE[stage] ?? 1;
  const hatchling = stage === "hatchling";
  const held = mood === "grateful" ? heldStar() : hatchling ? heldPebble() : "";
  const layers = crab({ traits, palette, mood, eyeScale: hatchling ? 1.45 : 1, held });
  const shell = hatchling ? "" : shellGroup(state, shellScale(stage, state.stars, state.majorReleases) / cs);

  const animal = `<g ${scaleAround(GROUND, cs)}>${layers.back}${layers.body}${shell}${layers.front}</g>`;
  const filtered = mood === "lonely" ? `<g filter="url(#sp-lonely)" opacity=".9">${animal}</g>` : animal;
  const motion =
    mood === "celebrating"
      ? `<g transform="translate(118 152)"><g class="sp-shadow"><ellipse rx="54" ry="6" fill="#2B1D1A" opacity=".14"/></g></g><g class="sp-jump">${filtered}</g>`
      : `<g class="sp-bob">${filtered}</g>`;

  return motion + gifts + moodProps(mood) + (stage === "elder" ? sparkles(ELDER_SPARKLES) : "") + shine;
}

const FILTERS =
  `<defs><filter id="sp-fade"><feColorMatrix type="saturate" values="0.3"/></filter>` +
  `<filter id="sp-lonely"><feColorMatrix type="saturate" values="0.5"/></filter></defs>`;

function svgOpen(layout: Layout, size: Size, viewBox: string, title: string): string {
  const [w, h] = SIZES[layout][size];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>`;
}

function fitText(text: string, maxWidth: number, maxSize: number, charW = 0.6): number {
  return Math.max(9, Math.min(maxSize, +(maxWidth / (text.length * charW)).toFixed(1)));
}

interface Caption {
  title: string;
  meta: string[];
  cta: { star: boolean; text: string };
}

function wide(body: string, caption: Caption, opts: RenderOptions, ariaTitle: string): string {
  const x = WIDE.scene + 20;
  const maxW = WIDE.w - x - 14;
  const title = caption.title.length > 34 ? `${caption.title.slice(0, 33)}…` : caption.title;
  const fs = fitText(title, maxW, 19);
  const lines = caption.meta;
  const y0 = lines.length > 1 ? 40 : 46;
  const metaY = (i: number) => y0 + 22 + i * 16;
  const ctaY = metaY(lines.length - 1) + 24;
  const meta = lines
    .map((l, i) => `<text class="sp-t2" x="${x}" y="${metaY(i)}" font-size="12.5">${esc(l)}</text>`)
    .join("");
  const icon = caption.cta.star
    ? `<path transform="translate(${x + 7} ${ctaY - 4.5})" d="${starPath(7.5)}" fill="${GOLD}"/>`
    : `<text x="${x}" y="${ctaY}" font-size="13" fill="${GOLD}">✦</text>`;
  const cta = `${icon}<text class="sp-t2" x="${x + 19}" y="${ctaY}" font-size="12.5">${esc(caption.cta.text)}</text>`;

  return (
    svgOpen("wide", opts.size, `0 0 ${WIDE.w} ${WIDE.h}`, ariaTitle) +
    styles(opts.theme) +
    FILTERS +
    frame() +
    backdrop() +
    `<g transform="translate(48 -8) scale(.79)">${body}</g>` +
    `<g font-family="${FONT}"><text class="sp-t1" x="${x}" y="${y0}" font-size="${fs}" font-weight="700">${esc(title)}</text>${meta}${cta}</g>` +
    border() +
    `</svg>`
  );
}

function square(body: string, opts: RenderOptions, ariaTitle: string): string {
  return svgOpen("square", opts.size, "-6 -26 236 236", ariaTitle) + styles(opts.theme) + FILTERS + body + `</svg>`;
}

function metaLines(stage: string, mood: string | null): string[] {
  const parts = [`Stage: ${stage}`, ...(mood ? [`Mood: ${mood}`] : [])];
  const joined = parts.join(" · ");
  return joined.length > 27 ? parts : [joined];
}

export function render(state: PetState, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const abandoned = state.stage === "abandoned";
  const name = `${state.owner}/${state.repo}`;
  const aria = `${name}: ${stageLabel(state.stage)} hermit crab${abandoned ? "" : `, ${state.mood}`}`;
  const body = creature(state);
  if (opts.layout === "square") return square(body, opts, aria);

  const cta = state.traits.shiny
    ? { star: false, text: "shiny" }
    : abandoned
      ? { star: true, text: "push to bring me back" }
      : { star: true, text: "star to feed me" };
  return wide(
    body,
    { title: name, meta: metaLines(stageLabel(state.stage), abandoned ? null : moodLabel(state.mood)), cta },
    opts,
    aria,
  );
}

/** Friendly fallback when the repo can't be found. Badges must always render. */
export function renderLostEgg(owner: string, repo: string, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const body = sandPatch() + `<g class="sp-bob">${egg(true)}</g>`;
  const aria = `${owner}/${repo}: lost egg`;
  if (opts.layout === "square") return square(body, opts, aria);
  return wide(
    body,
    { title: `${owner}/${repo}`, meta: ["Stage: Lost egg"], cta: { star: false, text: "repo not found" } },
    opts,
    aria,
  );
}
