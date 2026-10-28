import type { LanguageShell } from "@/lib/languages";
import type { GenericShell } from "@/lib/traits";
import type { ShellArt, ShellPalette } from "./common";
import { genericShell } from "./generic";
import { typescriptShell } from "./typescript";
import { javascriptShell } from "./javascript";
import { pythonShell } from "./python";
import { rustShell } from "./rust";
import { goShell } from "./go";
import { javaShell } from "./java";
import { cppShell } from "./cpp";
import { rubyShell } from "./ruby";
import { swiftShell } from "./swift";
import { bashShell } from "./shell";

export type { ShellArt, ShellPalette } from "./common";

const LANGUAGE_ART: Record<LanguageShell, () => ShellArt> = {
  typescript: typescriptShell,
  javascript: javascriptShell,
  python: pythonShell,
  rust: rustShell,
  go: goShell,
  java: javaShell,
  cpp: cppShell,
  ruby: rubyShell,
  swift: swiftShell,
  shell: bashShell,
};

export function shellArt(lang: LanguageShell | null, form: GenericShell, palette: ShellPalette): ShellArt {
  return lang ? LANGUAGE_ART[lang]() : genericShell(form, palette);
}
