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

function check(svg: string) {
  expect(xmlProblems(svg)).toEqual([]);
  expect(svg.length).toBeLessThan(25_000);
  expect(svg).not.toMatch(/<script|href="http|@import|url\(http/);
}

describe("render", () => {
  it.each(STAGES)("stage %s", (stage) => {
    const svg = render({ ...base, stage }, { theme: "light" });
    check(svg);
    expect(svg).toMatchSnapshot();
  });

  it.each(MOODS)("mood %s", (mood) => {
    const svg = render({ ...base, mood }, { layout: "square" });
    check(svg);
    expect(svg).toMatchSnapshot();
  });

  it.each(LANGUAGE_SHELLS)("language %s", (lang) => {
    const language = LANG_NAMES[lang] ?? lang[0].toUpperCase() + lang.slice(1);
    const svg = render({ ...base, language: lang === "typescript" ? "TypeScript" : lang === "javascript" ? "JavaScript" : language }, { layout: "square" });
    check(svg);
    expect(svg).toMatchSnapshot();
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
