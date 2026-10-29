// The GitHub → pet path with mocked responses.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchSnapshot, GitHubUnavailable, RepoNotFound } from "@/lib/github";
import { petFromSnapshot } from "@/lib/pet";

const now = new Date("2026-10-28T12:00:00Z");

function repoData(over: Record<string, unknown> = {}) {
  return {
    repository: {
      name: "lib",
      isPrivate: false,
      isArchived: false,
      stargazerCount: 42,
      owner: { login: "amy", __typename: "User" },
      primaryLanguage: { name: "Rust" },
      issues: { totalCount: 0 },
      defaultBranchRef: { target: { committedDate: "2026-10-27T10:00:00Z" } },
      latestRelease: { nodes: [] },
      releaseTags: { nodes: [{ tagName: "v2.0.0" }, { tagName: "v1.4.0" }] },
      forks: { nodes: [] },
      ...over,
    },
    merged: { issueCount: 0 },
    unanswered: { nodes: [] },
    outside: { issueCount: 3 },
    newPrs: { nodes: [] },
  };
}

type Reply = { status?: number; body?: unknown; headers?: Record<string, string> };

function mockGitHub(replies: { graphql: Reply; contributors?: Reply; stars?: Reply }) {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      calls.push(url);
      const r = url.endsWith("/graphql")
        ? replies.graphql
        : url.includes("/contributors")
          ? (replies.contributors ?? { body: [{}], headers: { link: '<x?page=7>; rel="last"' } })
          : (replies.stars ?? { body: [] });
      return new Response(typeof r.body === "string" ? r.body : JSON.stringify(r.body ?? {}), {
        status: r.status ?? 200,
        headers: r.headers,
      });
    }),
  );
  return calls;
}

beforeEach(() => vi.stubEnv("GITHUB_TOKEN", "test-token"));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("fetchSnapshot", () => {
  it("builds a snapshot from three requests", async () => {
    const calls = mockGitHub({ graphql: { body: { data: repoData() } } });
    const s = await fetchSnapshot("amy", "lib", now);
    expect(calls).toHaveLength(3);
    expect(s).toMatchObject({ owner: "amy", repo: "lib", stars: 42, contributors: 7, majorReleases: 2, language: "Rust", ownerIsUser: true });
  });

  it("uses GitHub's exact open-issue count, not one derived from PRs", async () => {
    mockGitHub({ graphql: { body: { data: repoData({ issues: { totalCount: 0 } }) } } });
    const s = await fetchSnapshot("amy", "lib", now);
    expect(s.openIssues).toBe(0);
    expect(petFromSnapshot(s, now).pet.mood).not.toBe("anxious");
  });

  it("treats private repos exactly like missing ones", async () => {
    mockGitHub({ graphql: { body: { data: repoData({ isPrivate: true }) } } });
    await expect(fetchSnapshot("amy", "lib", now)).rejects.toBeInstanceOf(RepoNotFound);
    mockGitHub({ graphql: { body: { data: { repository: null }, errors: [{ type: "NOT_FOUND", message: "nope" }] } } });
    await expect(fetchSnapshot("amy", "nope", now)).rejects.toBeInstanceOf(RepoNotFound);
  });

  it("reports rate limits and failed lookups as unavailable instead of inventing data", async () => {
    mockGitHub({ graphql: { status: 403, body: { message: "rate limit" } } });
    await expect(fetchSnapshot("amy", "lib", now)).rejects.toBeInstanceOf(GitHubUnavailable);
    mockGitHub({ graphql: { body: { data: repoData() } }, contributors: { status: 502 } });
    await expect(fetchSnapshot("amy", "lib", now)).rejects.toBeInstanceOf(GitHubUnavailable);
  });

  it("caps contributors for histories GitHub won't count", async () => {
    mockGitHub({ graphql: { body: { data: repoData() } }, contributors: { status: 403, body: "history or contributor list is too large" } });
    expect((await fetchSnapshot("amy", "lib", now)).contributors).toBe(100);
  });

  it("needs a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    mockGitHub({ graphql: { body: { data: repoData() } } });
    await expect(fetchSnapshot("amy", "lib", now)).rejects.toBeInstanceOf(GitHubUnavailable);
  });

  it("feeds stars from daily history into gratitude and gifts", async () => {
    const week = Math.floor((now.getTime() - 3 * 86_400_000) / 1000);
    mockGitHub({ graphql: { body: { data: repoData() } }, stars: { body: [{ week, total: 1, days: [0, 0, 0, 1, 0, 0, 0] }] } });
    const { pet, reason } = petFromSnapshot(await fetchSnapshot("amy", "lib", now), now);
    expect(pet.mood).toBe("grateful");
    expect(pet.recentStar).toBe(true);
    expect(reason).toMatch(/starred/);
  });
});
