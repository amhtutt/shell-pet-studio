// GET /api/pet/:owner/:repo.svg?layout=wide|square&theme=auto|light|dark&size=sm|md|lg
import { RepoNotFound } from "@/lib/github";
import { parseOptions, svgResponse } from "@/lib/options";
import { petFromSnapshot } from "@/lib/pet";
import { validRepoName } from "@/lib/repo";
import { getSnapshot } from "@/lib/snapshot";
import { render, renderLostEgg, renderUnavailable } from "@/svg/render";

const CACHE_OK = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const CACHE_MISSING = "public, max-age=0, s-maxage=600, stale-while-revalidate=3600";
const CACHE_ERROR = "public, max-age=0, s-maxage=120";

// The badge always renders. Status headers let the website explain what happened outside the image.
export async function GET(req: Request, { params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo: raw } = await params;
  const repo = raw.replace(/\.svg$/i, "");
  const options = parseOptions(new URL(req.url).searchParams);

  if (!validRepoName(owner, repo)) {
    return svgResponse(renderLostEgg(owner.slice(0, 39), repo.slice(0, 100), options), CACHE_MISSING, { status: "missing" });
  }
  try {
    const snap = await getSnapshot(owner, repo);
    const { pet, reason } = petFromSnapshot(snap);
    return svgResponse(render(pet, options), CACHE_OK, { status: "ok", reason, fetchedAt: snap.fetchedAt });
  } catch (err) {
    // Missing and private repos look the same from outside. Anything else is GitHub being unavailable:
    // say so, and keep that answer only briefly, so the real crab is back as soon as GitHub is.
    if (err instanceof RepoNotFound) return svgResponse(renderLostEgg(owner, repo, options), CACHE_MISSING, { status: "missing" });
    return svgResponse(renderUnavailable(owner, repo, options), CACHE_ERROR, { status: "unavailable" });
  }
}
