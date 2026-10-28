export const LANGUAGE_SHELLS = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "cpp",
  "ruby",
  "swift",
  "shell",
] as const;
export type LanguageShell = (typeof LANGUAGE_SHELLS)[number];

const SHELL_BY_LANGUAGE: Record<string, LanguageShell> = {
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  rust: "rust",
  go: "go",
  java: "java",
  c: "cpp",
  "c++": "cpp",
  ruby: "ruby",
  swift: "swift",
  shell: "shell",
  bash: "shell",
};

/** Subset of GitHub linguist colors, keyed by lowercase language name. */
export const LINGUIST_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f1e05a",
  python: "#3572A5",
  rust: "#dea584",
  go: "#00ADD8",
  java: "#b07219",
  c: "#555555",
  "c++": "#f34b7d",
  "c#": "#178600",
  ruby: "#701516",
  swift: "#F05138",
  shell: "#89e051",
  kotlin: "#A97BFF",
  php: "#4F5D95",
  dart: "#00B4AB",
  scala: "#c22d40",
  elixir: "#6e4a7e",
  erlang: "#B83998",
  haskell: "#5e5086",
  lua: "#000080",
  perl: "#0298c3",
  r: "#198CE7",
  julia: "#a270ba",
  zig: "#ec915c",
  nim: "#ffc200",
  ocaml: "#ef7a08",
  clojure: "#db5855",
  "f#": "#b845fc",
  "objective-c": "#438eff",
  vue: "#41b883",
  svelte: "#ff3e00",
  astro: "#ff5a03",
  html: "#e34c26",
  css: "#663399",
  scss: "#c6538c",
  mdx: "#fcb32c",
  "jupyter notebook": "#DA5B0B",
  dockerfile: "#384d54",
  makefile: "#427819",
  nix: "#7e7eff",
  powershell: "#012456",
  solidity: "#AA6746",
  "vim script": "#199f4b",
  "emacs lisp": "#c065db",
  crystal: "#000100",
  groovy: "#4298b8",
  hcl: "#844FBA",
  v: "#4f87c4",
  gleam: "#ffaff3",
  mojo: "#ff4c1f",
  assembly: "#6E4C13",
  fortran: "#4d41b1",
  cuda: "#3A4E3A",
  tex: "#3D6117",
  "common lisp": "#3fb68b",
  racket: "#3c5caa",
  elm: "#60B5CC",
  purescript: "#1D222D",
  reason: "#ff5847",
  coffeescript: "#244776",
};

export function languageShell(language: string | null | undefined): LanguageShell | null {
  if (!language) return null;
  return SHELL_BY_LANGUAGE[language.toLowerCase()] ?? null;
}

export function linguistColor(language: string | null | undefined): string | null {
  if (!language) return null;
  return LINGUIST_COLORS[language.toLowerCase()] ?? null;
}
