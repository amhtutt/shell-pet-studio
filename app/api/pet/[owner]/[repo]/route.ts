// GET /api/pet/:owner/:repo.svg?layout=wide|square&theme=auto|light|dark&size=sm|md|lg
import { fetchRepoStats, RepoNotFound } from "@/lib/github";
import { parseOptions, svgResponse } from "@/lib/options";
import { petFromStats, validRepoName } from "@/lib/pet";
import { render, renderLostEgg } from "@/svg/render";

export const revalidate = 3600;

const CACHE_OK = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const CACHE_MISSING = "public, max-age=0, s-maxage=600, stale-while-revalidate=3600";
const CACHE_ERROR = "public, max-age=0, s-maxage=120";

export async function GET(req: Request, { params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo: raw } = await params;
  const repo = raw.replace(/\.svg$/i, "");
  const options = parseOptions(new URL(req.url).searchParams);

  if (!validRepoName(owner, repo)) return svgResponse(renderLostEgg(owner.slice(0, 39), repo.slice(0, 100), options), CACHE_MISSING);

  try {
    const stats = await fetchRepoStats(owner, repo);
    return svgResponse(render(petFromStats(stats), options), CACHE_OK);
  } catch (err) {
    // Badges must always render: unknown repos and API failures both show the lost egg.
    const missing = err instanceof RepoNotFound;
    if (!missing) console.error("shell-pet: GitHub fetch failed", owner, repo, err);
    return svgResponse(renderLostEgg(owner, repo, options), missing ? CACHE_MISSING : CACHE_ERROR);
  }
}
