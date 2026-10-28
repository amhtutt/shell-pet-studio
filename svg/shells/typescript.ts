import { DOME_SLOTS, band, dome, spire, type ShellArt } from "./common";

// Glossy blue spiral, one white stripe.
export function typescriptShell(): ShellArt {
  const gloss = `<ellipse cx="-30" cy="-68" rx="13" ry="6" transform="rotate(-32 -30 -68)" fill="#FFFFFF" opacity=".55"/>`;
  return { svg: spire("#3A7BD5") + dome("#3A7BD5", "#2C62B0", band("#FFFFFF", 13) + gloss), slots: DOME_SLOTS };
}
