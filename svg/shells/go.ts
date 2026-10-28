import { DOME_SLOTS, dome, spiralPath, spire, type ShellArt } from "./common";

// Smooth light-cyan round spiral.
export function goShell(): ShellArt {
  const swirl = `<path d="${spiralPath(-50, -44, 24, 1.9)}" fill="none" stroke="#3F9DB4" stroke-width="4" stroke-linecap="round"/>`;
  return { svg: spire("#8EDCEB", "#3F9DB4") + dome("#8EDCEB", "#6CC4D6", swirl), slots: DOME_SLOTS };
}
