import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, OPTIONS } from "@/app/api/pet/[owner]/[repo]/route";
import { OPTIONS as previewOptions } from "@/app/api/preview/route";
import { RepoNotFound, GitHubUnavailable, type RepoSnapshot } from "@/lib/github";
import { getSnapshot } from "@/lib/snapshot";

vi.mock("@/lib/snapshot", () => ({ getSnapshot: vi.fn() }));
const snapshot: RepoSnapshot = {
  owner: "amhtutt", repo: "shell-pet-studio", ownerIsUser: true,
  fetchedAt: new Date().toISOString(), stars: 80, openIssues: 0,
  language: "TypeScript", archived: false, contributors: 3, majorReleases: 1,
  lastCommitAt: new Date().toISOString(), lastReleaseAt: null, lastForkAt: null,
  lastFirstTimeContributorAt: null, mergedLastDay: 0, outsideLast60d: 1,
  oldestUnansweredIssueAt: null, lastStarDayAt: null, starsLast60d: 0,
};
const request = () => GET(new Request("https://example.com/api/pet/amhtutt/shell-pet-studio.svg?layout=wide&theme=light"), {
  params: Promise.resolve({ owner: "amhtutt", repo: "shell-pet-studio.svg" }),
});
beforeEach(() => { vi.mocked(getSnapshot).mockReset(); });

describe("merged live badge API", () => {
  it("returns a real badge with reason, timestamp and readable CORS headers", async () => {
    vi.mocked(getSnapshot).mockResolvedValue(snapshot);
    const res = await request();
    expect(res.headers.get("X-Shell-Pet-Status")).toBe("ok");
    expect(res.headers.get("X-Shell-Pet-Reason")).toContain("commit this week");
    expect(res.headers.get("X-Shell-Pet-Fetched-At")).toBe(snapshot.fetchedAt);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Expose-Headers")).toContain("X-Shell-Pet-Fetched-At");
    expect(await res.text()).toContain("amhtutt/shell-pet-studio");
    expect(getSnapshot).toHaveBeenCalledWith("amhtutt", "shell-pet-studio");
  });
  it("identifies missing and private repositories", async () => {
    vi.mocked(getSnapshot).mockRejectedValue(new RepoNotFound());
    const missing = await request();
    expect(missing.headers.get("X-Shell-Pet-Status")).toBe("missing");
    expect(await missing.text()).toContain("repo not found");
  });
  it("identifies an upstream outage", async () => {
    vi.mocked(getSnapshot).mockRejectedValue(new GitHubUnavailable("GitHub is busy"));
    const unavailable = await request();
    expect(unavailable.headers.get("X-Shell-Pet-Status")).toBe("unavailable");
    expect(await unavailable.text()).toContain("GitHub is busy");
  });
  it("both routes retain the 40965ad OPTIONS handlers", () => {
    for (const handler of [OPTIONS, previewOptions]) {
      const res = handler();
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("OPTIONS");
    }
  });
});
