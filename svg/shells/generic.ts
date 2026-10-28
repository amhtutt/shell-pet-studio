import type { GenericShell } from "@/lib/traits";
import { INK } from "../util";
import { DOME_SLOTS, OUTLINE, band, dome, shape, spiralPath, spire, type ShellArt, type ShellPalette } from "./common";

const CONE = "M7 2C12 -30 -8 -70 -38 -118C-62 -96 -92 -52 -92 -14C-82 8 -30 12 7 2Z";
const CONE_SLOTS: [number, number][] = [
  [-40, -40],
  [-62, -22],
  [-22, -24],
  [-48, -72],
  [-68, -46],
  [-28, -56],
  [-42, -96],
  [-80, -22],
];

const SPIKES: [number, number, number, number][] = [
  [-18, -78, -10, -100],
  [-44, -86, -42, -110],
  [-70, -80, -78, -102],
  [-90, -60, -110, -72],
];

export function genericShell(form: GenericShell, p: ShellPalette): ShellArt {
  switch (form) {
    case "spiral":
      return { svg: spire(p.base) + dome(p.base, p.shadow, band(p.band)), slots: DOME_SLOTS };
    case "round":
      return {
        svg: dome(
          p.base,
          p.shadow,
          band(p.band, 12) +
            `<path d="${spiralPath(-54, -46, 22, 1.8)}" fill="none" stroke="${p.band}" stroke-width="4.5" stroke-linecap="round"/>`,
        ),
        slots: DOME_SLOTS,
      };
    case "conch": {
      const spikes = SPIKES.map(
        ([bx, by, tx, ty]) => `<path d="M${bx - 9} ${by + 4}L${tx} ${ty}L${bx + 9} ${by + 4}Z" fill="${p.base}" ${OUTLINE}/>`,
      ).join("");
      return { svg: spikes + spire(p.base) + dome(p.base, p.shadow, band(p.band, 10)), slots: DOME_SLOTS };
    }
    case "cone": {
      const stripes = ["M-110 -26L30 -58", "M-104 -60L14 -88", "M-90 -92L-10 -114"]
        .map((d) => `<path d="${d}" fill="none" stroke="${p.band}" stroke-width="7"/>`)
        .join("");
      return {
        svg:
          shape("sp-cone", CONE, p.base, p.shadow, stripes) +
          `<path d="M-38 -118L-40 -126" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
        slots: CONE_SLOTS,
      };
    }
  }
}
