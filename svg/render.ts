import { languageShell, linguistColor } from "@/lib/languages";
import { moodLabel, type Mood } from "@/lib/mood";
import { growthStage, shellScale, stageLabel, type Stage } from "@/lib/stage";
import { BODY_COLORS, type Traits } from "@/lib/traits";
import { ART } from "./art/assets";
import decorationSlots from "./art/decoration-slots.json";
import shellInteriors from "./art/shell-interiors.json";
import { decoration, prop, resetSprites, spriteDefs } from "./props";
import { backdrop, border, frame, WIDE } from "./scene";
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

// Every art layer fills the same frame (240 x 170 units, feet at y≈165), so layers just stack.
const { w: FW, h: FH, ground: GY } = ART.frame;
const GROUND: [number, number] = [150, GY];
const SHELL_ANCHOR: [number, number] = [95, 135];
const CRAB_SCALE: Partial<Record<Stage, number>> = { juvenile: 0.86, adult: 1, elder: 1.04 };
const SHINY_BAND = "#EDBB52";

const r1 = (n: number) => Math.round(n * 10) / 10;
const img = (src: string, extra = "") => `<image href="${src}" width="${FW}" height="${FH}"${extra}/>`;
const scaleAround = ([x, y]: [number, number], s: number) =>
  `transform="translate(${x} ${y}) scale(${+s.toFixed(3)}) translate(${-x} ${-y})"`;

function colorKey(traits: Traits): string {
  return traits.shiny ? "shiny" : traits.bodyColor;
}

function shellName(state: PetState): string {
  const lang = languageShell(state.language);
  // The Shell/Bash art is saved as shell-bash.png.
  return lang === "shell" ? "bash" : (lang ?? state.traits.genericShell);
}

function bandColor(state: PetState): string {
  if (state.traits.shiny) return SHINY_BAND;
  return linguistColor(state.language) ?? BODY_COLORS[state.traits.bodyColor].band;
}

/** One decoration per contributor: up to 3 on a juvenile's small shell, up to 8 from adult on. */
function decorationCount(stage: Stage, stars: number, contributors: number): number {
  const growth = stage === "resting" ? growthStage(stars) : stage;
  if (growth === "juvenile") return Math.min(contributors, 3);
  if (growth === "adult" || growth === "elder") return Math.min(contributors, 8);
  return 0;
}

/** RGB → feColorMatrix that paints a white image in that color. */
function tintMatrix(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3));
  return `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 1 0`;
}

/** The shell, its band and decorations. `back` is the dark gap fill that goes behind the crab. */
function shellParts(state: PetState): { back: string; front: string } {
  const name = shellName(state);
  const art = ART.shells[name];
  const band = art.band
    ? `<filter id="sp-band"><feColorMatrix type="matrix" values="${tintMatrix(bandColor(state))}"/></filter>` +
      img(art.band, ` filter="url(#sp-band)" style="mix-blend-mode:multiply"`)
    : "";
  const decos = (decorationSlots[name as keyof typeof decorationSlots] ?? [])
    .slice(0, decorationCount(state.stage, state.stars, state.contributors))
    .map(([x, y], i) => decoration(state.traits.decorations[i], x, y, i))
    .join("");
  const interior = shellInteriors[name as keyof typeof shellInteriors];
  return { back: `<path class="sp-shell-interior" d="${interior}" fill="#2B1D1A"/>`, front: img(art.shell) + band + decos };
}

/** Crab layer with an occasional blink: the closed-eye patch replaces just the eye box. */
function crabLayer(mood: Mood, color: string): string {
  const open = ART.crabs[mood]?.[color] ?? ART.crabs.happy[color];
  const blink = ART.blinks[mood]?.[color];
  if (!blink) return img(open);
  const { x, y, w, h } = ART.eyeBox;
  return (
    `<defs><image id="sp-crab" href="${open}" width="${FW}" height="${FH}"/>` +
    `<clipPath id="sp-noeyes"><path clip-rule="evenodd" d="M-20 -20H${FW + 20}V${FH + 20}H-20ZM${x} ${y}h${w}v${h}h${-w}Z"/></clipPath></defs>` +
    `<g class="sp-eo"><use href="#sp-crab"/></g>` +
    `<g class="sp-ec"><use href="#sp-crab" clip-path="url(#sp-noeyes)"/><image href="${blink}" x="${x}" y="${y}" width="${w}" height="${h}"/></g>`
  );
}

function moodProps(mood: Mood): string {
  switch (mood) {
    case "celebrating":
      return CONFETTI.map(([x, y, rot], i) => prop("confetti", x, y, 22, `sp-fall sp-d${i % 4}`, rot)).join("");
    case "anxious":
      return prop("papers", 238, 148, 34);
    case "curious":
      return prop("question", 236, 22, 30);
    case "happy":
      return prop("sparks", 238, 34, 26);
    case "lonely":
      return prop("cloud", 240, 36, 34);
    case "sleepy":
      return prop("z", 232, 30, 16, "sp-z") + prop("z", 246, 10, 21, "sp-z sp-d2");
    default:
      return "";
  }
}

const CONFETTI: [number, number, number][] = [
  [36, -6, 20],
  [110, -18, -30],
  [182, -8, 40],
  [244, 22, -15],
  [4, 36, 60],
];
const SHINY_SPARKLES: [number, number, number][] = [
  [0, 14, 18],
  [236, 2, 14],
  [250, 112, 13],
];
const ELDER_SPARKLES: [number, number, number][] = [
  [-10, 64, 16],
  [58, -10, 14],
  [226, 0, 16],
  [252, 136, 12],
];
const sparkles = (pts: [number, number, number][]) =>
  pts.map(([x, y, s], i) => prop("sparkle", x, y, s, `sp-twinkle sp-d${i % 4}`)).join("");

// An empty shell rests on the sand, shifted left a little since no crab sticks out of it.
const REST_DX = -10;

function restDrop(state: PetState): number {
  return r1(GY - 4 - ART.shellMeta[shellName(state)].box[3]);
}

/** Where the shell's opening is, in the shell's own (un-dropped) frame. */
function shellMouth(state: PetState): [number, number] {
  const [, , x1, y1] = ART.shellMeta[shellName(state)].box;
  return [x1 - 22, y1 - 24];
}

/** A shell resting on the sand with the crab tucked inside; `extra` is drawn in the shell's frame. */
function restingShell(state: PetState, extra: string): string {
  const { front } = shellParts(state);
  return `<g transform="translate(${REST_DX} ${restDrop(state)})">${front}${extra}</g>`;
}

/** The creature in its own frame (about -10..255 wide, feet at y≈165), and the highest y it reaches. */
export function creature(state: PetState): { svg: string; top: number } {
  const { traits, stage, mood } = state;
  const color = colorKey(traits);
  const gifts = state.recentStar && stage !== "egg"
    ? traits.gifts
        .slice(0, traits.giftCount)
        .map((k, i) => prop(k === "star" ? "giftStar" : "giftShell", i ? 22 : 0, i ? 164 : 160, 18))
        .join("")
    : "";
  const shine = traits.shiny ? sparkles(SHINY_SPARKLES) : "";

  if (stage === "egg") return { svg: `<g class="sp-bob">${img(ART.stages.egg)}</g>` + shine, top: EGG_TOP };

  const [mx, my] = shellMouth(state);
  // The same opening once the shell is resting on the sand.
  const mouth: [number, number] = [mx + REST_DX, my + restDrop(state)];

  // Resting (archived or 180+ quiet days) and sleeping (90+ days) both nap inside the shell with a nightcap.
  if (stage === "resting" || mood === "sleeping") {
    const zTop = mouth[1] - 86 - 13;
    return {
      svg:
        `<g class="sp-bob">${restingShell(state, prop("nightcap", mx + 14, my - 4, 46, "", -10))}</g>` +
        prop("z", mouth[0] + 34, mouth[1] - 40, 16, "sp-z") +
        prop("z", mouth[0] + 48, mouth[1] - 62, 20, "sp-z sp-d1") +
        prop("z", mouth[0] + 62, mouth[1] - 86, 25, "sp-z sp-d2") +
        gifts +
        shine,
      top: Math.min(zTop, ART.shellMeta[shellName(state)].box[1] + restDrop(state)),
    };
  }

  const cs = CRAB_SCALE[stage] ?? 1;
  const crab = crabLayer(mood, color);
  // Shell grows with stars and releases; the art's own size is the adult's middle.
  const grow = Math.min(1.14, Math.max(0.86, shellScale(stage, state.stars, state.majorReleases) / 0.95 / cs));
  const { back, front } = shellParts(state);
  const animal =
    `<g ${scaleAround(GROUND, cs)}>` +
    `<g ${scaleAround(SHELL_ANCHOR, grow)}>${back}</g>${crab}<g ${scaleAround(SHELL_ANCHOR, grow)}>${front}</g>` +
    `</g>`;
  const filtered = mood === "lonely" ? `<g filter="url(#sp-lonely)" opacity=".92">${animal}</g>` : animal;
  const motion =
    mood === "celebrating"
      ? `<g transform="translate(130 ${r1(GY + 2)})"><g class="sp-shadow"><ellipse rx="100" ry="7" fill="#2B1D1A" opacity=".13"/></g></g><g class="sp-jump">${filtered}</g>`
      : `<g class="sp-bob">${filtered}</g>`;
  const props = `<g ${scaleAround(GROUND, cs)}>${moodProps(mood)}</g>`;

  // Highest point reached while animating, so the wide badge can make room for it.
  const atScale = (y: number) => GY + (y - GY) * cs;
  const shellTop = atScale(SHELL_ANCHOR[1] + (ART.shellMeta[shellName(state)].box[1] - SHELL_ANCHOR[1]) * grow);
  const tops = [shellTop - (mood === "celebrating" ? JUMP : BOB), atScale(PROP_TOP[mood] ?? GY)];
  if (stage === "elder") tops.push(-18);
  if (traits.shiny) tops.push(-7);

  return {
    svg: motion + props + gifts + (stage === "elder" ? sparkles(ELDER_SPARKLES) : "") + shine,
    top: Math.min(...tops),
  };
}

// Tallest point of each mood's props (frame units), and of the egg; plus the jump and bob heights.
const PROP_TOP: Partial<Record<Mood, number>> = { celebrating: -30, curious: 7, happy: 21, lonely: 19, sleepy: -1 };
const EGG_TOP = 85;
const JUMP = 14;
const BOB = 3;

const FILTERS = `<defs><filter id="sp-lonely"><feColorMatrix type="saturate" values="0.5"/></filter></defs>`;

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

// The creature's feet land at y=110 of the wide scene. It's shrunk if needed so its highest point,
// animation included, stays at least 4 units inside the top edge.
const WIDE_FEET = 110;
const WIDE_SCALE = 0.63;

function wideFit(top: number): string {
  const k = Math.min(WIDE_SCALE, (WIDE_FEET - 4) / (GY - top));
  return `translate(${r1(132 - 125 * k)} ${r1(WIDE_FEET - GY * k)}) scale(${+k.toFixed(3)})`;
}

function wide(body: { svg: string; top: number }, caption: Caption, opts: RenderOptions, ariaTitle: string): string {
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
    spriteDefs() +
    frame() +
    backdrop() +
    `<g transform="${wideFit(body.top)}">${body.svg}</g>` +
    `<g font-family="${FONT}"><text class="sp-t1" x="${x}" y="${y0}" font-size="${fs}" font-weight="700">${esc(title)}</text>${meta}${cta}</g>` +
    border() +
    `</svg>`
  );
}

function square(body: { svg: string }, opts: RenderOptions, ariaTitle: string): string {
  return svgOpen("square", opts.size, "-14 -62 274 274", ariaTitle) + styles(opts.theme) + FILTERS + spriteDefs() + body.svg + `</svg>`;
}

function metaLines(stage: string, mood: string | null): string[] {
  const parts = [`Stage: ${stage}`, ...(mood ? [`Mood: ${mood}`] : [])];
  const joined = parts.join(" · ");
  return joined.length > 27 ? parts : [joined];
}

export function render(state: PetState, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const resting = state.stage === "resting";
  const name = `${state.owner}/${state.repo}`;
  const aria = `${name}: ${stageLabel(state.stage)} hermit crab${resting ? "" : `, ${state.mood}`}`;
  resetSprites();
  const body = creature(state);
  if (opts.layout === "square") return square(body, opts, aria);

  const cta = state.traits.shiny ? { star: false, text: "shiny" } : { star: true, text: "star to feed me" };
  return wide(
    body,
    { title: name, meta: metaLines(stageLabel(state.stage), resting ? null : moodLabel(state.mood)), cta },
    opts,
    aria,
  );
}

/** Friendly fallback when the repo can't be found. Badges must always render. */
export function renderLostEgg(owner: string, repo: string, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  resetSprites();
  const body = { svg: `<g class="sp-bob">${img(ART.stages.egg)}</g>` + prop("question", 186, 58, 34), top: 40 };
  const aria = `${owner}/${repo}: lost egg`;
  if (opts.layout === "square") return square(body, opts, aria);
  return wide(
    body,
    { title: `${owner}/${repo}`, meta: ["Stage: Lost egg"], cta: { star: false, text: "repo not found" } },
    opts,
    aria,
  );
}

/** GitHub couldn't be reached and nothing is cached yet: a resting egg that says so, without guessing. */
export function renderUnavailable(owner: string, repo: string, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  resetSprites();
  const body = {
    svg: `<g class="sp-bob">${img(ART.stages.egg)}</g>` + prop("z", 176, 70, 18, "sp-z") + prop("z", 192, 48, 22, "sp-z sp-d2"),
    top: 30,
  };
  const aria = `${owner}/${repo}: temporarily unavailable`;
  if (opts.layout === "square") return square(body, opts, aria);
  return wide(
    body,
    { title: `${owner}/${repo}`, meta: ["GitHub is busy", "Back in a few minutes"], cta: { star: false, text: "resting" } },
    opts,
    aria,
  );
}
