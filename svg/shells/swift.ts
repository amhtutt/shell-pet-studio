import { DOME_SLOTS, OUTLINE, band, dome, spire, type ShellArt } from "./common";

// Orange shell with a single swept-back fin.
export function swiftShell(): ShellArt {
  const fin = `<path d="M-44 -84C-66 -102 -96 -100 -120 -82C-102 -80 -92 -74 -86 -62Z" fill="#F7A250" ${OUTLINE}/>`;
  return { svg: fin + spire("#F28C38") + dome("#F28C38", "#DC7428", band("#FBB66E", 14)), slots: DOME_SLOTS };
}
