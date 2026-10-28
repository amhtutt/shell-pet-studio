import { OUTLINE, type ShellArt } from "./common";

// Gray hex nut.
const HEX = "M8 -40L-18 -86L-70 -86L-96 -40L-70 4L-18 4Z";
const TOP = "M8 -40L-18 -86L-70 -86L-96 -40Z";

export function cppShell(): ShellArt {
  return {
    svg:
      `<path d="M8 -40L8 -32L-18 12L-70 12L-96 -32L-96 -40L-70 4L-18 4Z" fill="#7F858E" ${OUTLINE}/>` +
      `<path d="${HEX}" fill="#A9AEB6"/>` +
      `<path d="${TOP}" fill="#C3C7CD"/>` +
      `<path d="${HEX}" fill="none" ${OUTLINE}/>` +
      `<path d="M-18 4L-18 12M-70 4L-70 12" stroke="#2B1D1A" stroke-width="3"/>` +
      `<circle cx="-44" cy="-40" r="22" fill="#4B4F57" ${OUTLINE}/>` +
      `<path d="M-60 -50A20 20 0 0 1 -30 -58" fill="none" stroke="#6E737B" stroke-width="4" stroke-linecap="round"/>`,
    slots: [
      [-76, -64],
      [-12, -64],
      [-80, -18],
      [-8, -18],
      [-44, -76],
      [-44, -6],
      [-26, -72],
      [-62, -74],
    ],
  };
}
