import { INK } from "../util";
import { DOME_SLOTS, OUTLINE, dome, spiralPath, type ShellArt } from "./common";

// Coiled shell, blue and yellow halves with a wavy seam.
const SEAM = "M-120 -14C-96 -18 -84 -34 -60 -38C-36 -42 -20 -58 26 -60";

export function pythonShell(): ShellArt {
  const blue = `<path d="${SEAM}L30 -120L-120 -120Z" fill="#3D74B0"/>`;
  const seam = `<path d="${SEAM}" fill="none" stroke="${INK}" stroke-width="3"/>`;
  const coil = `<path d="${spiralPath(-54, -50, 20, 1.6)}" fill="none" stroke="#2B5A8C" stroke-width="3.5" stroke-linecap="round"/>`;
  const tail =
    `<circle cx="-94" cy="-44" r="17" fill="#F5D04A" ${OUTLINE}/>` +
    `<path d="${spiralPath(-98, -44, 8, 1.3)}" fill="none" stroke="#C89E22" stroke-width="3" stroke-linecap="round"/>`;
  return { svg: tail + dome("#F5D04A", "#E3B735", blue + coil + seam), slots: DOME_SLOTS };
}
