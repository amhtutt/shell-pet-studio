import { OUTLINE, type ShellArt } from "./common";

// Tiny black terminal monitor with a blinking green cursor.
export function bashShell(): ShellArt {
  return {
    svg:
      `<rect x="-98" y="-88" width="104" height="92" rx="16" fill="#3B3F46" ${OUTLINE}/>` +
      `<path d="M-98 -20L6 -20L6 -12Q6 4 -10 4L-82 4Q-98 4 -98 -12Z" fill="#2E3238"/>` +
      `<rect x="-98" y="-88" width="104" height="92" rx="16" fill="none" ${OUTLINE}/>` +
      `<rect x="-80" y="-74" width="74" height="50" rx="7" fill="#14171B" stroke="#1B1E22" stroke-width="2"/>` +
      `<path d="M-72 -62L-64 -55L-72 -48" fill="none" stroke="#3DDC6E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<g class="sp-cursor"><rect x="-58" y="-62" width="8" height="13" rx="1" fill="#3DDC6E"/></g>` +
      `<path d="M-91 -66L-91 -40M-86 -66L-86 -40" stroke="#5A5F68" stroke-width="2.5" stroke-linecap="round"/>`,
    slots: [
      [-86, -12],
      [-64, -10],
      [-90, -80],
      [-40, -12],
      [-16, -80],
      [-60, -82],
      [-36, -82],
      [-20, -12],
    ],
  };
}
