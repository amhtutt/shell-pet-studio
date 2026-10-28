import { INK, SW } from "../util";

/** Everything a shell needs to draw itself in shell-local coordinates (aperture anchor at 0,0). */
export interface ShellArt {
  /** Markup drawn in the shell-local frame. */
  svg: string;
  /** Decoration anchor points on the shell surface. */
  slots: [number, number][];
}

export interface ShellPalette {
  base: string;
  shadow: string;
  band: string;
}

export const DOME = "M6 2C14 -40 -10 -88 -52 -86C-92 -84 -104 -40 -88 -10C-76 10 -30 12 6 2Z";
export const DOME_SLOTS: [number, number][] = [
  [-40, -58],
  [-64, -38],
  [-22, -28],
  [-72, -64],
  [-36, -78],
  [-52, -16],
  [-86, -28],
  [-14, -56],
];
export const BAND = "M-106 -34C-78 -82 -24 -96 16 -48";

const outline = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
export const OUTLINE = outline;

/** Filled shape + clipped soft shadow + clipped extras + outline on top. */
export function shape(id: string, d: string, fill: string, shadow: string, inner = ""): string {
  return (
    `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>` +
    `<path d="${d}" fill="${fill}"/>` +
    `<g clip-path="url(#${id})"><ellipse cx="-40" cy="10" rx="80" ry="24" fill="${shadow}"/>${inner}</g>` +
    `<path d="${d}" fill="none" ${outline}/>`
  );
}

export function dome(fill: string, shadow: string, inner = ""): string {
  return shape("sp-dome", DOME, fill, shadow, inner);
}

export function band(color: string, width = 16, d = BAND): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
}

/** Archimedean spiral as a polyline. */
export function spiralPath(cx: number, cy: number, maxR: number, turns = 1.6): string {
  const pts: string[] = [];
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = maxR * t;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

export function spire(fill: string, line = INK): string {
  return (
    `<circle cx="-94" cy="-44" r="17" fill="${fill}" ${outline}/>` +
    `<path d="${spiralPath(-100, -44, 8, 1.3)}" fill="none" stroke="${line}" stroke-width="3" stroke-linecap="round"/>`
  );
}
