import { INK, SW } from "../util";
import { OUTLINE, type ShellArt } from "./common";

// Coffee mug with steam swirl. Crab peeks out of a hole near the base.
const MUG = "M-92 -80L4 -80L4 -4Q-44 14 -92 -4Z";

export function javaShell(): ShellArt {
  const handle =
    `<path d="M-92 -66C-126 -66 -126 -18 -92 -18" fill="none" stroke="${INK}" stroke-width="${SW * 2 + 7}" stroke-linecap="round"/>` +
    `<path d="M-92 -66C-126 -66 -126 -18 -92 -18" fill="none" stroke="#F4EEE4" stroke-width="7" stroke-linecap="round"/>`;
  const body =
    `<defs><clipPath id="sp-mug"><path d="${MUG}"/></clipPath></defs>` +
    `<path d="${MUG}" fill="#F4EEE4"/>` +
    `<g clip-path="url(#sp-mug)"><path d="M-40 -90L20 -90L20 20L-30 20Q-22 -40 -40 -90Z" fill="#E4D9C8"/>` +
    `<path d="M6 -4L6 -46Q-16 -44 -18 -22Q-16 -6 6 -4Z" fill="#5A3B28"/></g>` +
    `<path d="${MUG}" fill="none" ${OUTLINE}/>`;
  const rim =
    `<ellipse cx="-44" cy="-80" rx="48" ry="10" fill="#F4EEE4" ${OUTLINE}/>` +
    `<ellipse cx="-44" cy="-79" rx="39" ry="6" fill="#6B4630"/>`;
  const bean =
    `<g transform="translate(-50 -40) rotate(28)"><ellipse rx="10" ry="14" fill="#7A4A2E"/>` +
    `<path d="M0 -10C-5 -3 5 3 0 10" fill="none" stroke="#F4EEE4" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const steam = `<g class="sp-steam"><path d="M-48 -98c-8 -8 8 -14 0 -22c-8 -8 6 -12 2 -18" fill="none" stroke="#C7B6A4" stroke-width="4" stroke-linecap="round"/></g>`;
  return {
    svg: handle + body + rim + bean + steam,
    slots: [
      [-72, -56],
      [-22, -60],
      [-74, -24],
      [-26, -24],
      [-56, -14],
      [-80, -40],
      [-10, -42],
      [-40, -64],
    ],
  };
}
