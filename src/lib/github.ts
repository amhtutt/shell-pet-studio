// GitHub REST data for one repo. The main repo call is required; every secondary call fails soft.
import type { Activity } from "./mood";

const API = "https://api.github.com";
const REVALIDATE = 3600;
const DAY = 86_400_000;

export interface RepoStats {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  archived: boolean;
  createdAt: Date;
  pushedAt: Date | null;
  contributors: number;
  majorReleases: number;
  activity: Activity;
}

export class RepoNotFound extends Error {}

type Json = Record<string, unknown>;

function headers(accept = "application/vnd.github+json"): HeadersInit {
  const h: Record<string, string> = { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "shell-pet" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function get(path: string, accept?: string): Promise<Response> {
  return fetch(`${API}${path}`, { headers: headers(accept), next: { revalidate: REVALIDATE } });
}

/** Run a secondary lookup; any error → fallback. */
async function soft<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function json<T = Json[]>(path: string, accept?: string): Promise<T> {
  const res = await get(path, accept);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return (await res.json()) as T;
}

const date = (v: unknown): Date | null => (typeof v === "string" ? new Date(v) : null);
const latest = (ds: (Date | null)[]): Date | null =>
  ds.reduce<Date | null>((a, d) => (d && (!a || d > a) ? d : a), null);

export function lastPageFromLink(link: string | null): number | null {
  const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return m ? Number(m[1]) : null;
}

export function countMajorVersions(tags: string[]): number {
  const majors = new Set<number>();
  for (const t of tags) {
    const m = t.match(/^v?(\d+)\.\d+/i);
    if (m) majors.add(Number(m[1]));
  }
  return majors.size;
}

const enc = (s: string) => encodeURIComponent(s);

export async function fetchRepoStats(owner: string, repo: string, now = new Date()): Promise<RepoStats> {
  const base = `/repos/${enc(owner)}/${enc(repo)}`;
  const res = await get(base);
  if (res.status === 404 || res.status === 451) throw new RepoNotFound(`${owner}/${repo}`);
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const r = (await res.json()) as Json;
  const ownerLogin = ((r.owner as Json)?.login as string) ?? owner;
  const stars = Number(r.stargazers_count ?? 0);
  const since60 = new Date(now.getTime() - 60 * DAY).toISOString();

  const [contributors, latestRelease, majorReleases, lastStarAt, pulls, commits, ownerCommits, issuesRecent, unanswered, lastForkAt] =
    await Promise.all([
      soft(0, async () => {
        const res = await get(`${base}/contributors?per_page=1&anon=1`);
        if (res.status === 204) return 0;
        if (!res.ok) throw new Error();
        const last = lastPageFromLink(res.headers.get("link"));
        return last ?? ((await res.json()) as unknown[]).length;
      }),
      soft<Date | null>(null, async () => date((await json<Json>(`${base}/releases/latest`)).published_at)),
      soft(0, async () => countMajorVersions((await json(`${base}/releases?per_page=100`)).map((x) => String(x.tag_name ?? "")))),
      soft<Date | null>(null, async () => {
        if (stars <= 0) return null;
        // Pagination caps out at 400 pages of 100, i.e. 40k stargazers.
        const page = Math.min(Math.ceil(stars / 100), 400);
        const list = await json(`${base}/stargazers?per_page=100&page=${page}`, "application/vnd.github.star+json");
        return date(list[list.length - 1]?.starred_at);
      }),
      soft<Json[]>([], () => json(`${base}/pulls?state=all&sort=updated&direction=desc&per_page=20`)),
      soft<Json[]>([], () => json(`${base}/commits?per_page=1`)),
      soft<Json[]>([], () => json(`${base}/commits?per_page=1&author=${enc(ownerLogin)}`)),
      soft<Json[]>([], () => json(`${base}/issues?state=all&since=${since60}&per_page=50`)),
      soft<Json[]>([], () => json(`${base}/issues?state=open&sort=created&direction=asc&per_page=20`)),
      soft<Date | null>(null, async () => date((await json(`${base}/forks?sort=newest&per_page=1`))[0]?.created_at)),
    ]);

  const commitDate = (c: Json | undefined) => {
    const commit = c?.commit as Json | undefined;
    return date((commit?.committer as Json)?.date ?? (commit?.author as Json)?.date);
  };
  const login = (x: Json) => ((x.user as Json)?.login as string | undefined)?.toLowerCase();
  const isOutside = (x: Json) => login(x) !== ownerLogin.toLowerCase() && !String(login(x)).endsWith("[bot]");

  const lastMergedPrAt = latest(pulls.map((p) => date(p.merged_at)));
  const lastFirstTimeContributorAt = latest(
    pulls
      .filter((p) => ["FIRST_TIME_CONTRIBUTOR", "FIRST_TIMER"].includes(String(p.author_association)))
      .map((p) => date(p.created_at)),
  );
  const lastOutsideActivityAt = latest(issuesRecent.filter(isOutside).map((i) => date(i.created_at)));
  const oldestUnansweredIssueAt =
    unanswered.filter((i) => !i.pull_request && Number(i.comments) === 0).map((i) => date(i.created_at))[0] ?? null;

  const pushedAt = date(r.pushed_at);
  return {
    owner: ownerLogin,
    repo: (r.name as string) ?? repo,
    stars,
    forks: Number(r.forks_count ?? 0),
    openIssues: Number(r.open_issues_count ?? 0),
    language: (r.language as string | null) ?? null,
    archived: Boolean(r.archived),
    createdAt: date(r.created_at) ?? now,
    pushedAt,
    contributors,
    majorReleases,
    activity: {
      now,
      lastCommitAt: commitDate(commits[0]) ?? pushedAt,
      lastOwnerCommitAt: commitDate(ownerCommits[0]),
      lastReleaseAt: latestRelease,
      lastMergedPrAt,
      lastStarAt,
      lastForkAt,
      lastFirstTimeContributorAt,
      lastOutsideActivityAt,
      // GitHub's open_issues_count includes PRs; subtract the open ones we saw.
      openIssues: Math.max(0, Number(r.open_issues_count ?? 0) - pulls.filter((p) => p.state === "open").length),
      oldestUnansweredIssueAt,
    },
  };
}

