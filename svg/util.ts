export const INK = "#2B1D1A";
export const CHEEK = "#F7A9A0";
export const GOLD = "#F6C343";
export const SW = 4.5; // outline width in creature units

export const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Five-point star centred on the origin. */
export function starPath(outer: number, inner = outer * 0.48): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${r1(Math.cos(a) * r)} ${r1(Math.sin(a) * r)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Four-point sparkle centred on the origin. */
export function sparklePath(r: number): string {
  const k = r * 0.2;
  return `M0 ${-r}Q${k} ${-k} ${r} 0Q${k} ${k} 0 ${r}Q${-k} ${k} ${-r} 0Q${-k} ${-k} 0 ${-r}Z`;
}

/** Cog with `teeth` teeth centred on the origin. */
export function gearPath(r: number, teeth = 8): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (Math.PI * 2 * i) / (teeth * 4);
    const rr = i % 4 < 2 ? r : r * 0.74;
    pts.push(`${r1(Math.cos(a) * rr)} ${r1(Math.sin(a) * rr)}`);
  }
  return `M${pts.join("L")}Z`;
}

export const g = (attrs: string, inner: string) => `<g ${attrs}>${inner}</g>`;
export const tr = (x: number, y: number, s = 1, rot = 0) =>
  `transform="translate(${r1(x)} ${r1(y)})${rot ? ` rotate(${rot})` : ""}${s !== 1 ? ` scale(${+s.toFixed(3)})` : ""}"`;
