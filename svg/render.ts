import { languageShell, linguistColor } from "@/lib/languages";
import { moodLabel, type Mood } from "@/lib/mood";
import { shellScale, stageLabel, type Stage } from "@/lib/stage";
import { BODY_COLORS, type Traits } from "@/lib/traits";
import { ART } from "./art/assets";
import { decoration, prop } from "./props";
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
const CRAB_SCALE: Partial<Record<Stage, number>> = { hatchling: 0.72, juvenile: 0.86, adult: 1, elder: 1.04 };
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

function decorationCount(stage: Stage, contributors: number): number {
  if (stage === "juvenile") return Math.min(contributors, 3);
  if (stage === "adult" || stage === "elder" || stage === "abandoned") return Math.min(contributors, 8);
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
  const meta = ART.shellMeta[name];
  const band = art.band
    ? `<filter id="sp-band"><feColorMatrix type="matrix" values="${tintMatrix(bandColor(state))}"/></filter>` +
      img(art.band, ` filter="url(#sp-band)" style="mix-blend-mode:multiply"`)
    : "";
  const decos = meta.slots
    .slice(0, decorationCount(state.stage, state.contributors))
    .map(([x, y], i) => decoration(state.traits.decorations[i], x, y, i))
    .join("");
  return { back: img(art.back), front: img(art.shell) + band + decos };
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
      return CONFETTI.map(([x, y, rot], i) => prop("confetti", x, y, 12, `sp-fall sp-d${i % 4}`, rot)).join("");
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
  [40, -6, 20],
  [92, -14, -30],
  [150, -4, 40],
  [214, 4, -15],
  [20, 30, 10],
  [244, 40, 60],
  [120, -20, -45],
  [190, 26, 25],
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

/** An empty shell resting on the sand (sleeping and abandoned); `extra` is drawn in the shell's frame. */
function restingShell(state: PetState, extra: string, fade: boolean): string {
  const { front } = shellParts(state);
  const body = `<g transform="translate(${REST_DX} ${restDrop(state)})">${front}${extra}</g>`;
  return fade ? `<g filter="url(#sp-fade)" opacity=".85">${body}</g>` : body;
}

/** The creature in its own frame: about -10..255 wide, feet at y≈165. */
export function creature(state: PetState): string {
  const { traits, stage, mood } = state;
  const color = colorKey(traits);
  const gifts = state.recentStar && stage !== "egg"
    ? traits.gifts
        .slice(0, traits.giftCount)
        .map((k, i) => prop(k === "star" ? "giftStar" : "giftShell", i ? 22 : 0, i ? 164 : 160, 18))
        .join("")
    : "";
  const shine = traits.shiny ? sparkles(SHINY_SPARKLES) : "";

  if (stage === "egg") return `<g class="sp-bob">${img(ART.stages.egg)}</g>` + shine;
  if (stage === "cracking") return `<g class="sp-bob">${img(ART.stages.cracking[color])}</g>` + gifts + shine;

  const [mx, my] = shellMouth(state);
  // The same opening once the shell is resting on the sand.
  const mouth: [number, number] = [mx + REST_DX, my + restDrop(state)];

  if (stage === "abandoned") {
    return (
      restingShell(state, prop("cobweb", mx - 4, my - 6, 40), true) +
      prop("leaf", 14, 164, 24, "", -18) + prop("leaf", 170, 166, 22, "", 14) + prop("leaf", 196, 168, 20, "", -6) +
      gifts
    );
  }

  if (mood === "sleeping") {
    return (
      `<g class="sp-bob">${restingShell(state, prop("nightcap", mx + 14, my - 4, 46, "", -10), false)}</g>` +
      prop("z", mouth[0] + 34, mouth[1] - 40, 16, "sp-z") +
      prop("z", mouth[0] + 48, mouth[1] - 62, 20, "sp-z sp-d1") +
      prop("z", mouth[0] + 62, mouth[1] - 86, 25, "sp-z sp-d2") +
      gifts + shine
    );
  }

  const cs = CRAB_SCALE[stage] ?? 1;
  const hatchling = stage === "hatchling";
  const crab = crabLayer(mood, color);
  let animal: string;
  if (hatchling) {
    animal = `<g ${scaleAround(GROUND, cs)}>${crab}</g>` + decoration("pebble", 236, 160, 0, 18);
  } else {
    // Shell grows with stars and releases; the art's own size is the adult's middle.
    const grow = Math.min(1.14, Math.max(0.86, shellScale(stage, state.stars, state.majorReleases) / 0.95 / cs));
    const { back, front } = shellParts(state);
    animal =
      `<g ${scaleAround(GROUND, cs)}>` +
      `<g ${scaleAround(SHELL_ANCHOR, grow)}>${back}</g>${crab}<g ${scaleAround(SHELL_ANCHOR, grow)}>${front}</g>` +
      `</g>`;
  }
  const filtered = mood === "lonely" ? `<g filter="url(#sp-lonely)" opacity=".92">${animal}</g>` : animal;
  const motion =
    mood === "celebrating"
      ? `<g transform="translate(130 ${r1(GY + 2)})"><g class="sp-shadow"><ellipse rx="100" ry="7" fill="#2B1D1A" opacity=".13"/></g></g><g class="sp-jump">${filtered}</g>`
      : `<g class="sp-bob">${filtered}</g>`;
  // Props shrink with the crab, but not all the way for a tiny hatchling or they'd be lost.
  const props = `<g ${scaleAround(GROUND, hatchling ? 0.9 : cs)}>${moodProps(mood)}</g>`;
  // A shell-less hatchling is all front end; slide it back so it sits centred.
  const scene = hatchling ? `<g transform="translate(-60 0)">${motion}${props}</g>` : motion + props;

  return scene + gifts + (stage === "elder" ? sparkles(ELDER_SPARKLES) : "") + shine;
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

// Where the creature frame lands in the wide scene: feet at y≈110. Elders' bigger shells need a smaller fit.
const WIDE_FIT = { normal: "translate(52 6) scale(.63)", tall: "translate(58 13) scale(.59)" };

function wide(body: string, caption: Caption, opts: RenderOptions, ariaTitle: string, tall = false): string {
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
    `<g transform="${tall ? WIDE_FIT.tall : WIDE_FIT.normal}">${body}</g>` +
    `<g font-family="${FONT}"><text class="sp-t1" x="${x}" y="${y0}" font-size="${fs}" font-weight="700">${esc(title)}</text>${meta}${cta}</g>` +
    border() +
    `</svg>`
  );
}

function square(body: string, opts: RenderOptions, ariaTitle: string): string {
  return svgOpen("square", opts.size, "-14 -62 274 274", ariaTitle) + styles(opts.theme) + FILTERS + body + `</svg>`;
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
    state.stage === "elder",
  );
}

/** Friendly fallback when the repo can't be found. Badges must always render. */
export function renderLostEgg(owner: string, repo: string, options: Partial<RenderOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const body = `<g class="sp-bob">${img(ART.stages.egg)}</g>` + prop("question", 186, 58, 34);
  const aria = `${owner}/${repo}: lost egg`;
  if (opts.layout === "square") return square(body, opts, aria);
  return wide(
    body,
    { title: `${owner}/${repo}`, meta: ["Stage: Lost egg"], cta: { star: false, text: "repo not found" } },
    opts,
    aria,
  );
}
