// Shell-less stages: egg and cracking. (Hatchling/abandoned are composed in render.ts.)
import type { CrabPalette } from "./crab";
import { INK, SW } from "./util";

const EGG = "M112 84C134 84 142 112 140 127C138 143 126 151 112 151C98 151 86 143 84 127C82 112 90 84 112 84Z";
const SPOTS = `<g fill="#E2BC92"><ellipse cx="101" cy="104" rx="5" ry="4"/><circle cx="123" cy="98" r="3"/><ellipse cx="127" cy="126" rx="5.5" ry="4.5"/><circle cx="99" cy="134" r="3.5"/><circle cx="114" cy="118" r="2.5"/></g>`;

export function sandPatch(): string {
  return `<ellipse cx="114" cy="151" rx="50" ry="8" fill="#EFD9B0"/>`;
}

export function egg(question = false): string {
  return (
    `<path d="${EGG}" fill="#FBF3E6" stroke="${INK}" stroke-width="${SW}"/>` +
    SPOTS +
    (question
      ? `<text x="112" y="132" text-anchor="middle" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="34" font-weight="800" fill="${INK}" opacity=".8">?</text>`
      : "")
  );
}

export function crackingEgg(palette: CrabPalette): string {
  const hole = "M98 108L106 100L114 110L120 102L128 110L126 122Q112 128 100 120Z";
  return (
    egg() +
    `<path d="${hole}" fill="#3A2A25" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
    `<circle cx="113" cy="116" r="9" fill="${palette.base}"/>` +
    `<g transform="translate(113 115)"><g class="sp-blink"><circle r="7" fill="${INK}"/><circle cx="2.3" cy="-2.5" r="2.4" fill="#FFFFFF"/></g></g>` +
    `<path d="M86 114L98 108M128 110L139 116" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`
  );
}
