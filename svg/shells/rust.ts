import { INK, gearPath } from "../util";
import { DOME_SLOTS, dome, spire, type ShellArt } from "./common";

// Orange-brown iron shell with rivets and two small gears.
const RIVETS: [number, number][] = [
  [-92, -30],
  [-80, -60],
  [-58, -78],
  [-30, -80],
  [-8, -62],
  [0, -32],
];

export function rustShell(): ShellArt {
  const seam = `<path d="M-100 -20C-90 -70 -40 -96 6 -54" fill="none" stroke="#8A3D1B" stroke-width="5"/>`;
  const gears =
    `<path d="${gearPath(15, 9)}" transform="translate(-56 -44)" fill="#8E4120"/><circle cx="-56" cy="-44" r="5" fill="#B85A2B"/>` +
    `<path d="${gearPath(9, 7)}" transform="translate(-26 -22)" fill="#8E4120"/><circle cx="-26" cy="-22" r="3" fill="#B85A2B"/>`;
  const rivets = RIVETS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#D2D5DA" stroke="${INK}" stroke-width="2"/>`).join("");
  return { svg: spire("#B85A2B") + dome("#B85A2B", "#97461F", seam + gears + rivets), slots: DOME_SLOTS };
}
