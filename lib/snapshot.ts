// One cached snapshot per repo, shared by every layout, theme and size of its badge.
// unstable_cache keeps serving the last good snapshot if a refresh fails, so a GitHub outage or rate limit
// shows yesterday's crab rather than a wrong one.
import { unstable_cache } from "next/cache";
import { fetchSnapshot, type RepoSnapshot } from "./github";

export const SNAPSHOT_TTL_SECONDS = 3600;

const cached = unstable_cache(
  async (owner: string, repo: string): Promise<RepoSnapshot> => {
    const started = Date.now();
    try {
      const snap = await fetchSnapshot(owner, repo);
      console.info(JSON.stringify({ event: "snapshot", repo: `${owner}/${repo}`, ms: Date.now() - started }));
      return snap;
    } catch (err) {
      console.error(
        JSON.stringify({ event: "snapshot_failed", repo: `${owner}/${repo}`, ms: Date.now() - started, error: String(err) }),
      );
      throw err;
    }
  },
  ["repo-snapshot-v2"],
  { revalidate: SNAPSHOT_TTL_SECONDS },
);

/** Owner and repo are case-insensitive on GitHub, so they share one cache entry. */
export function getSnapshot(owner: string, repo: string): Promise<RepoSnapshot> {
  return cached(owner.toLowerCase(), repo.toLowerCase());
}
