import { INK } from "../util";
import { OUTLINE, type ShellArt } from "./common";

// Red faceted gem.
const GEM = "M-72 -92L-20 -92L6 -60L-6 2L-82 4L-100 -58Z";

export function rubyShell(): ShellArt {
  const facet = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`;
  const line = (d: string) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  return {
    svg:
      `<path d="${GEM}" fill="#D9363E"/>` +
      facet("M-72 -92L-20 -92L-30 -60L-64 -60Z", "#F0666B") +
      facet("M-30 -60L6 -60L-6 2L-44 3Z", "#B52A31") +
      facet("M-100 -58L-64 -60L-82 4Z", "#E34C53") +
      line("M-100 -58L6 -60M-72 -92L-64 -60L-82 4M-20 -92L-30 -60L-44 3M-64 -60L-44 3") +
      `<path d="${GEM}" fill="none" ${OUTLINE}/>` +
      `<path d="M-60 -84L-44 -84" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".75"/>`,
    slots: [
      [-78, -40],
      [-18, -36],
      [-50, -76],
      [-62, -16],
      [-28, -14],
      [-90, -56],
      [-6, -56],
      [-46, -40],
    ],
  };
}
