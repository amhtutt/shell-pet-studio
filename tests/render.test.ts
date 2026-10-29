import { describe, expect, it } from "vitest";
import { LANGUAGE_SHELLS } from "@/lib/languages";
import { MOODS } from "@/lib/mood";
import { STAGES } from "@/lib/stage";
import { GENERIC_SHELLS, traitsFromSeed } from "@/lib/traits";
import { render, renderLostEgg, type PetState } from "@/svg/render";
import { xmlProblems } from "./xml";

const LANG_NAMES: Record<string, string> = { cpp: "C++", shell: "Shell" };
const base: PetState = {
  owner: "amhtutt",
  repo: "shell-pet",
  traits: traitsFromSeed(42),
  stage: "adult",
  mood: "happy",
  language: null,
  stars: 450,
  contributors: 5,
  majorReleases: 1,
  recentStar: false,
};

// Badges embed WebP art layers, so they're bigger than the old drawn ones. GitHub is fine with this size.
const MAX_BYTES = 80_000;

function check(svg: string) {
  expect(xmlProblems(svg)).toEqual([]);
  expect(svg.length).toBeLessThan(MAX_BYTES);
  // Self-contained: only inline data, never a network fetch or script.
  expect(svg).not.toMatch(/<script|href="http|@import|url\(http/);
  for (const m of svg.matchAll(/href="([^"#][^"]*)"/g)) expect(m[1]).toMatch(/^data:image\/webp;base64,/);
}

describe("render", () => {
  it.each(STAGES)("stage %s", (stage) => {
    const svg = render({ ...base, stage }, { theme: "light" });
    check(svg);
  });

  it.each(MOODS)("mood %s", (mood) => {
    const svg = render({ ...base, mood }, { layout: "square" });
    check(svg);
    if (mood !== "sleeping") expect(svg).toContain("sp-bob");
  });

  it.each(LANGUAGE_SHELLS)("language %s", (lang) => {
    const language = LANG_NAMES[lang] ?? lang[0].toUpperCase() + lang.slice(1);
    const svg = render({ ...base, language: lang === "typescript" ? "TypeScript" : lang === "javascript" ? "JavaScript" : language }, { layout: "square" });
    check(svg);
  });

  it.each(GENERIC_SHELLS)("generic shell %s", (genericShell) => {
    check(render({ ...base, traits: { ...base.traits, genericShell }, language: "Kotlin" }));
  });

  it("shiny, gifts and every layout/theme/size are valid", () => {
    for (const layout of ["wide", "square"] as const)
      for (const theme of ["auto", "light", "dark"] as const)
        for (const size of ["sm", "md", "lg"] as const)
          check(render({ ...base, traits: { ...base.traits, shiny: true }, recentStar: true }, { layout, theme, size }));
  });

  it("blinks only for moods with open eyes", () => {
    expect(render({ ...base, mood: "curious" })).toContain(`class="sp-ec"`);
    expect(render({ ...base, mood: "happy" })).not.toContain(`class="sp-ec"`);
  });

  it("shows one decoration per contributor, up to 8", () => {
    const count = (n: number) =>
      (render({ ...base, contributors: n }).match(/class="sp-deco"/g) ?? []).length;
    expect(count(0)).toBe(0);
    expect(count(3)).toBe(3);
    expect(count(20)).toBe(8);
  });

  it("escapes repo names and uses dark media query for auto theme", () => {
    const svg = render({ ...base, owner: "a&b", repo: "<x>" });
    expect(svg).toContain("a&amp;b/&lt;x&gt;");
    expect(svg).toContain("prefers-color-scheme:dark");
    expect(svg).toContain("prefers-reduced-motion");
  });

  it("renders a lost egg", () => {
    const svg = renderLostEgg("nobody", "nothing");
    check(svg);
    expect(svg).toContain("repo not found");
  });
});
