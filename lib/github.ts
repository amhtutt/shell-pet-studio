// GitHub data for one public repo: one GraphQL query plus two REST calls (contributors, daily star history).
// Every lookup is required. A failure throws, so the caller keeps the last good snapshot instead of
// rendering a story the data doesn't support. See lib/snapshot.ts.

const API = "https://api.github.com";
const TIMEOUT_MS = 8000;
const DAY = 86_400_000;
const HOUR = 3_600_000;

/** Everything shell-pet knows about a repo, JSON-safe so it can be cached (dates are ISO strings). */
export interface RepoSnapshot {
  owner: string;
  repo: string;
  ownerIsUser: boolean;
  fetchedAt: string;
  stars: number;
  openIssues: number;
  language: string | null;
  archived: boolean;
  contributors: number;
  majorReleases: number;
  lastCommitAt: string | null;
  lastReleaseAt: string | null;
  lastForkAt: string | null;
  lastFirstTimeContributorAt: string | null;
  /** PRs merged in the 24h before fetchedAt. */
  mergedLastDay: number;
  /** Issues/PRs opened by someone other than the owner in the 60 days before fetchedAt. */
  outsideLast60d: number;
  /** Oldest open issue with no comments that is at least 14 days old. */
  oldestUnansweredIssueAt: string | null;
  /** Start of the most recent day that had stars, from GitHub's daily star history (day buckets aren't exactly UTC). */
  lastStarDayAt: string | null;
  /** Stars in the 60 days before fetchedAt, from the same history. */
  starsLast60d: number;
}

export class RepoNotFound extends Error {}
export class GitHubUnavailable extends Error {}

type Json = Record<string, unknown>;

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new GitHubUnavailable("GITHUB_TOKEN is not set");
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "shell-pet",
    Authorization: `Bearer ${token}`,
  };
}

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  try {
    // The snapshot is cached as a whole (lib/snapshot.ts), so individual requests skip Next's fetch cache.
    return await fetch(`${API}${path}`, {
      ...init,
      headers: { ...headers(), ...(init.headers as Record<string, string>) },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new GitHubUnavailable(`${path}: ${(err as Error).message}`);
  }
}

function failed(res: Response, what: string): never {
  const limited = res.status === 403 || res.status === 429;
  throw new GitHubUnavailable(`${what}: HTTP ${res.status}${limited ? " (rate limited?)" : ""}`);
}

export function lastPageFromLink(link: string | null): number | null {
  const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return m ? Number(m[1]) : null;
}

/** Distinct major versions among release tags like v2, v2.1, 3.0.0. */
export function countMajorVersions(tags: string[]): number {
  const majors = new Set<number>();
  for (const t of tags) {
    const m = t.match(/^v?(\d+)(?:\.|$)/i);
    if (m) majors.add(Number(m[1]));
  }
  return majors.size;
}

interface StarWeek {
  week: number;
  days: number[];
}

/** From GitHub's weekly star history: the latest day with stars, and stars since `since`. */
export function summarizeStarHistory(weeks: StarWeek[], now: Date, since: Date): { lastStarDayAt: string | null; stars: number } {
  let last: number | null = null;
  let stars = 0;
  for (const w of weeks) {
    w.days.forEach((n, i) => {
      const day = (w.week + i * 86_400) * 1000;
      if (n <= 0 || day > now.getTime()) return;
      if (last === null || day > last) last = day;
      if (day >= since.getTime() - DAY) stars += n;
    });
  }
  return { lastStarDayAt: last === null ? null : new Date(last).toISOString(), stars };
}

// Search windows are rounded down to the hour, so the same query is reused within an hour.
const iso = (d: Date) => new Date(Math.floor(d.getTime() / HOUR) * HOUR).toISOString().replace(/\.000Z$/, "Z");

const QUERY = `query($owner: String!, $name: String!, $merged: String!, $unanswered: String!, $outside: String!, $newPrs: String!) {
  repository(owner: $owner, name: $name) {
    name isPrivate isArchived stargazerCount
    owner { login __typename }
    primaryLanguage { name }
    issues(states: OPEN) { totalCount }
    defaultBranchRef { target { ... on Commit { committedDate } } }
    latestRelease: releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { publishedAt } }
    releaseTags: releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { tagName } }
    forks(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { createdAt } }
  }
  merged: search(type: ISSUE, query: $merged, first: 1) { issueCount }
  unanswered: search(type: ISSUE, query: $unanswered, first: 1) { nodes { ... on Issue { createdAt } } }
  outside: search(type: ISSUE, query: $outside, first: 1) { issueCount }
  newPrs: search(type: ISSUE, query: $newPrs, first: 50) { nodes { ... on PullRequest { createdAt authorAssociation } } }
}`;

async function graphql(owner: string, repo: string, now: Date): Promise<Json> {
  const slug = `repo:${owner}/${repo}`;
  const day = (n: number) => iso(new Date(now.getTime() - n * DAY));
  const variables = {
    owner,
    name: repo,
    merged: `${slug} is:pr is:merged merged:>=${day(1)}`,
    unanswered: `${slug} is:issue is:open comments:0 created:<${day(14)} sort:created-asc`,
    outside: `${slug} -author:${owner} created:>=${day(60)}`,
    newPrs: `${slug} is:pr created:>=${day(7)}`,
  };
  const res = await call("/graphql", { method: "POST", body: JSON.stringify({ query: QUERY, variables }) });
  if (!res.ok) failed(res, "graphql");
  const body = (await res.json()) as { data?: Json; errors?: { type?: string; message: string }[] };
  if (body.errors?.some((e) => e.type === "NOT_FOUND")) throw new RepoNotFound(`${owner}/${repo}`);
  if (body.errors?.length || !body.data) throw new GitHubUnavailable(`graphql: ${body.errors?.[0]?.message ?? "no data"}`);
  return body.data;
}

async function contributorCount(owner: string, repo: string): Promise<number> {
  const res = await call(`/repos/${owner}/${repo}/contributors?per_page=1&anon=1`);
  if (res.status === 204) return 0;
  // GitHub refuses to count contributors for very large histories; those repos have plenty.
  if (res.status === 403 && /too large/i.test(await res.clone().text())) return 100;
  if (!res.ok) failed(res, "contributors");
  return lastPageFromLink(res.headers.get("link")) ?? ((await res.json()) as unknown[]).length;
}

async function starHistory(owner: string, repo: string): Promise<StarWeek[]> {
  // 9 weeks covers the 60-day windows the moods look at.
  const res = await call(`/repos/${owner}/${repo}/stargazers/history?per_page=9`);
  if (res.status === 404) return [];
  if (!res.ok) failed(res, "star history");
  return (await res.json()) as StarWeek[];
}

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
const nodes = (v: unknown): Json[] => ((v as Json | undefined)?.nodes as Json[] | undefined) ?? [];

export async function fetchSnapshot(owner: string, repo: string, now = new Date()): Promise<RepoSnapshot> {
  const data = await graphql(owner, repo, now);
  const r = data.repository as Json | null;
  // Public repos only: a private repo is reported exactly like a missing one, so nothing leaks.
  if (!r || r.isPrivate) throw new RepoNotFound(`${owner}/${repo}`);
  const ownerNode = r.owner as Json;
  const ownerLogin = String(ownerNode.login);

  const [contributors, weeks] = await Promise.all([contributorCount(ownerLogin, String(r.name)), starHistory(ownerLogin, String(r.name))]);
  const stars = summarizeStarHistory(weeks, now, new Date(now.getTime() - 60 * DAY));
  const firstTimers = nodes(data.newPrs)
    .filter((p) => ["FIRST_TIME_CONTRIBUTOR", "FIRST_TIMER"].includes(String(p.authorAssociation)))
    .map((p) => String(p.createdAt))
    .sort();

  return {
    owner: ownerLogin,
    repo: String(r.name),
    ownerIsUser: ownerNode.__typename === "User",
    fetchedAt: now.toISOString(),
    stars: Number(r.stargazerCount ?? 0),
    openIssues: Number((r.issues as Json)?.totalCount ?? 0),
    language: str((r.primaryLanguage as Json | null)?.name),
    archived: Boolean(r.isArchived),
    contributors,
    majorReleases: countMajorVersions(nodes(r.releaseTags).map((n) => String(n.tagName ?? ""))),
    lastCommitAt: str(((r.defaultBranchRef as Json | null)?.target as Json | undefined)?.committedDate),
    lastReleaseAt: str(nodes(r.latestRelease)[0]?.publishedAt),
    lastForkAt: str(nodes(r.forks)[0]?.createdAt),
    lastFirstTimeContributorAt: firstTimers.at(-1) ?? null,
    mergedLastDay: Number((data.merged as Json)?.issueCount ?? 0),
    outsideLast60d: Number((data.outside as Json)?.issueCount ?? 0),
    oldestUnansweredIssueAt: str(nodes(data.unanswered)[0]?.createdAt),
    lastStarDayAt: stars.lastStarDayAt,
    starsLast60d: stars.stars,
  };
}
