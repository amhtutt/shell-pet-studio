// Render any combination without GitHub, for the website and development.
// /api/preview?stage=adult&mood=happy&lang=TypeScript&seed=42&shiny=1&contributors=5&stars=500&releases=2&gift=1
import { MOODS, type Mood } from "@/lib/mood";
import { corsPreflight, parseOptions, svgResponse } from "@/lib/options";
import { validOwner, validRepo } from "@/lib/repo";
import { repoSeed } from "@/lib/seed";
import { STAGES, type Stage } from "@/lib/stage";
import { traitsFromSeed } from "@/lib/traits";
import { render } from "@/svg/render";

const DEFAULT_STARS: Record<Stage, number> = { egg: 0, juvenile: 8, adult: 80, elder: 2000, resting: 80 };

/** A whole number from the query, clamped to [min, max]; anything unparseable gets the fallback. */
function int(q: URLSearchParams, key: string, fallback: number, min: number, max: number): number {
  const raw = q.get(key);
  const n = raw !== null && /^\d{1,12}$/.test(raw) ? Number(raw) : fallback;
  return Math.min(max, Math.max(min, n));
}

const pick = <T extends string>(v: string | null, all: readonly T[], fallback: T): T =>
  v && (all as readonly string[]).includes(v) ? (v as T) : fallback;

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const stage = pick(q.get("stage"), STAGES, "adult");
  const mood: Mood = pick(q.get("mood"), MOODS, "happy");
  const owner = validOwner(q.get("owner") ?? "") ? q.get("owner")! : "amhtutt";
  const repo = validRepo(q.get("repo") ?? "") ? q.get("repo")! : "shell-pet-studio";
  // A numeric seed is used as-is; any other text is hashed like a repo name.
  const seedText = (q.get("seed") ?? "").slice(0, 100);
  const seed = /^\d{1,15}$/.test(seedText) ? Number(seedText) : repoSeed(owner, seedText || repo);
  const traits = traitsFromSeed(seed);
  if (q.get("shiny") === "1") traits.shiny = true;

  const svg = render(
    {
      owner,
      repo,
      traits,
      stage,
      mood,
      language: (q.get("lang") ?? "").slice(0, 40) || null,
      stars: int(q, "stars", DEFAULT_STARS[stage], 0, 10_000_000),
      contributors: int(q, "contributors", 5, 0, 100_000),
      majorReleases: int(q, "releases", 0, 0, 1000),
      recentStar: q.get("gift") === "1",
    },
    parseOptions(q),
  );
  return svgResponse(svg, "public, max-age=0, s-maxage=86400");
}

export const OPTIONS = corsPreflight;
