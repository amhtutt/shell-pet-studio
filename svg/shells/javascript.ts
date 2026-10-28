import { DOME_SLOTS, band, dome, spire, type ShellArt } from "./common";

// Yellow spiral, darker yellow band.
export function javascriptShell(): ShellArt {
  return { svg: spire("#F5D547") + dome("#F5D547", "#E5BE3A", band("#E3A92F", 15)), slots: DOME_SLOTS };
}
