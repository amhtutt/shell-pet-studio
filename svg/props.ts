// Small props in the creature frame (ground at y=150) and shell-local decorations.
import type { Decoration, Gift } from "@/lib/traits";
import { FONT, GOLD, INK, SW, sparklePath, starPath } from "./util";

const thin = (w = 2.4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

export function decoration(kind: Decoration, x: number, y: number, i: number, shiny: boolean): string {
  const at = `transform="translate(${x} ${y})"`;
  switch (kind) {
    case "barnacle":
      return `<g ${at}><circle r="6.5" fill="${shiny ? "#F6D77E" : "#FFFDF7"}" ${thin(2.6)}/><circle r="2.2" fill="${INK}"/></g>`;
    case "star":
      return `<path ${at} d="${starPath(9.5)}" fill="#F27C97" stroke="#D2557A" stroke-width="2.2" stroke-linejoin="round"/>`;
    case "flower": {
      const petal = i % 2 ? "#B79BE6" : "#F59BB5";
      const pts = Array.from({ length: 5 }, (_, k) => {
        const a = (Math.PI * 2 * k) / 5 - Math.PI / 2;
        return [(Math.cos(a) * 4.8).toFixed(1), (Math.sin(a) * 4.8).toFixed(1)];
      });
      return (
        `<g ${at}>` +
        pts.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="4" fill="${petal}" ${thin(2.2)}/>`).join("") +
        pts.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="2.9" fill="${petal}"/>`).join("") +
        `<circle r="2.8" fill="#FFE08A"/></g>`
      );
    }
    case "heart":
      return `<path transform="translate(${x} ${y}) scale(1.3)" d="M0 5C-8 -1 -7 -8 -3 -8C-1 -8 0 -6.5 0 -5.5C0 -6.5 1 -8 3 -8C7 -8 8 -1 0 5Z" fill="#7DB8F0" ${thin(1.8)}/>`;
    case "pebble":
      return `<ellipse ${at} rx="6.5" ry="5" fill="#B9B3AB" ${thin(2.4)}/>`;
  }
}

export function gift(kind: Gift, x: number, y: number): string {
  if (kind === "star") {
    return `<path transform="translate(${x} ${y}) rotate(14)" d="${starPath(7.5)}" fill="${GOLD}" ${thin(2.2)}/>`;
  }
  return (
    `<g transform="translate(${x} ${y})"><path d="M8 2C6 -6 -2 -12 -10 -8C-15 -5 -14 2 -8 4C-2 5 4 4 8 2Z" fill="#F7E7D2" ${thin(2.2)}/>` +
    `<path d="M-9 -2a3 3 0 1 1 3 3" fill="none" stroke="#D9A779" stroke-width="2" stroke-linecap="round"/></g>`
  );
}

export function sparkles(points: [number, number, number][]): string {
  return points
    .map(
      ([x, y, r], i) =>
        `<g transform="translate(${x} ${y})"><g class="sp-twinkle" style="animation-delay:${(-i * 0.7).toFixed(1)}s"><path d="${sparklePath(r)}" fill="${GOLD}"/></g></g>`,
    )
    .join("");
}

export function heldStar(): string {
  return `<path transform="translate(196 106) rotate(-10)" d="${starPath(13)}" fill="${GOLD}" ${thin(3.2)}/>`;
}

export function heldPebble(): string {
  return `<g transform="translate(198 138)"><ellipse rx="10" ry="7.5" fill="#A7A19A" ${thin(3.2)}/><ellipse cx="-3" cy="-3" rx="3" ry="1.6" fill="#C9C4BD"/></g>`;
}

const CONFETTI: [number, number, string, number][] = [
  [52, 30, "#F9C74F", 20],
  [84, 8, "#F28AB2", -30],
  [150, 14, "#7DC3F0", 40],
  [196, 30, "#F9C74F", -15],
  [28, 64, "#90D7A0", 10],
  [208, 2, "#F28AB2", 60],
  [118, -6, "#B79BE6", -45],
  [184, 64, "#7DC3F0", 25],
];

export function confetti(): string {
  return CONFETTI.map(
    ([x, y, c, rot], i) =>
      `<g transform="translate(${x} ${y}) rotate(${rot})"><g class="sp-fall" style="animation-delay:${(-i * 0.37).toFixed(2)}s"><rect x="-2.5" y="-5" width="5" height="10" rx="1.5" fill="${c}"/></g></g>`,
  ).join("");
}

export function sparks(): string {
  return `<path d="M192 52l7 -9M200 62l10 -4M185 44l2 -10" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>`;
}

export function questionMark(): string {
  return `<text x="196" y="50" font-family="${FONT}" font-size="34" font-weight="800" fill="${INK}" transform="rotate(10 196 50)">?</text>`;
}

export function sweatAndPapers(): string {
  const sheet = (y: number, rot: number) =>
    `<g transform="translate(214 ${y}) rotate(${rot})"><rect x="-14" y="-4" width="28" height="8" rx="1.5" fill="#FBF6EC" ${thin(2.4)}/></g>`;
  return (
    `<path transform="translate(196 78)" d="M0 -10Q8 2 0 8Q-8 2 0 -10Z" fill="#8CCEF2" ${thin(2.4)}/>` +
    sheet(146, -2) +
    sheet(139, 3) +
    sheet(132, -4) +
    sheet(125, 2) +
    `<path d="M204 124h18" stroke="#C9BBA6" stroke-width="1.6"/>`
  );
}

export function sighCloud(): string {
  const puffs: [number, number, number][] = [
    [198, 98, 6],
    [208, 93, 8],
    [219, 98, 6],
  ];
  return (
    `<g opacity=".95">` +
    puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#DCE8F2" ${thin(2.4)}/>`).join("") +
    puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 1.2}" fill="#DCE8F2"/>`).join("") +
    `</g>`
  );
}

export function zzz(points: [number, number, number][]): string {
  return points
    .map(
      ([x, y, s], i) =>
        `<g transform="translate(${x} ${y})"><g class="sp-z" style="animation-delay:${(-i * 1.2).toFixed(1)}s"><text font-family="${FONT}" font-size="${s}" font-weight="800" fill="${INK}">z</text></g></g>`,
    )
    .join("");
}

/** Nightcap poking out of the aperture, in shell-local coordinates. */
export function nightcap(): string {
  return (
    `<path d="M2 -48Q34 -46 44 -14Q24 -12 4 -10Z" fill="#9CC8EE" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>` +
    `<path d="M3 -18Q20 -20 34 -14" fill="none" stroke="#7FB2DE" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="45" cy="-13" r="6.5" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>`
  );
}

/** Dark empty opening + cobweb, in shell-local coordinates. */
export function emptyAperture(): string {
  const web = "M-2 -30L-2 -56M-2 -30L10 -10M-2 -30L-14 -8M-2 -30L-15 -46M-2 -30L9 -50M-8 -44Q-2 -40 4 -44Q8 -36 6 -24Q-2 -18 -9 -22Q-12 -34 -8 -44";
  return (
    `<ellipse cx="-2" cy="-30" rx="14" ry="27" transform="rotate(-14 -2 -30)" fill="#4A3B35" stroke="${INK}" stroke-width="${SW}"/>` +
    `<path d="${web}" fill="none" stroke="#F4F1EC" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>`
  );
}

export function dryLeaves(): string {
  const leaf = (x: number, y: number, rot: number, c: string) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-12 0Q0 -9 12 0Q0 9 -12 0Z" fill="${c}" ${thin(2.4)}/><path d="M-10 0H10" stroke="${INK}" stroke-width="1.6"/></g>`;
  return leaf(36, 152, -18, "#C08A4E") + leaf(150, 150, 12, "#A8743C") + leaf(176, 154, -6, "#C9995F");
}
