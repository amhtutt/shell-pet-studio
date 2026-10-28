// Dev route: render any combination without hitting GitHub.
// /api/preview?stage=adult&mood=happy&lang=TypeScript&seed=42&shiny=1&contributors=5&stars=500&gift=1
import { MOODS, type Mood } from "@/lib/mood";
import { parseOptions, svgResponse } from "@/lib/options";
import { repoSeed } from "@/lib/seed";
import { STAGES, type Stage } from "@/lib/stage";
import { traitsFromSeed } from "@/lib/traits";
import { render } from "@/svg/render";

const DEFAULT_STARS: Record<Stage, number> = {
  egg: 0,
  cracking: 2,
  hatchling: 10,
  juvenile: 70,
  adult: 450,
  elder: 8000,
  abandoned: 300,
};

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const stage = (STAGES as readonly string[]).includes(q.get("stage") ?? "") ? (q.get("stage") as Stage) : "adult";
  const mood = (MOODS as readonly string[]).includes(q.get("mood") ?? "") ? (q.get("mood") as Mood) : "happy";
  const seedParam = q.get("seed");
  const seed = seedParam && /^\d+$/.test(seedParam) ? Number(seedParam) : repoSeed("amhtutt", seedParam ?? "shell-pet");
  const traits = traitsFromSeed(seed);
  if (q.get("shiny") === "1") traits.shiny = true;

  const svg = render(
    {
      owner: q.get("owner") ?? "amhtutt",
      repo: q.get("repo") ?? "shell-pet",
      traits,
      stage,
      mood,
      language: q.get("lang"),
      stars: Number(q.get("stars") ?? DEFAULT_STARS[stage]),
      contributors: Number(q.get("contributors") ?? 5),
      majorReleases: Number(q.get("releases") ?? 0),
      recentStar: q.get("gift") === "1",
    },
    parseOptions(q),
  );
  return svgResponse(svg, "no-store");
}
