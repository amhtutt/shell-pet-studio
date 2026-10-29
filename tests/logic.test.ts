import { describe, expect, it } from "vitest";
import { countMajorVersions, lastPageFromLink, summarizeStarHistory } from "@/lib/github";
import { languageShell } from "@/lib/languages";
import { moodFor, moodWithReason, type Activity } from "@/lib/mood";
import { parseRepoInput, validRepoName } from "@/lib/repo";
import { cyrb53, repoSeed } from "@/lib/seed";
import { shellScale, stageFor } from "@/lib/stage";
import { isShiny, traitsFromSeed } from "@/lib/traits";

const now = new Date("2026-10-28T12:00:00Z");
const ago = (days: number) => new Date(now.getTime() - days * 86_400_000);
const quiet: Activity = {
  now,
  lastCommitAt: ago(10),
  lastReleaseAt: null,
  mergedLastDay: 0,
  lastStarDayAt: ago(30),
  starsLast60d: 4,
  lastForkAt: null,
  lastFirstTimeContributorAt: null,
  outsideLast60d: 2,
  ownerIsUser: true,
  oldestUnansweredIssueAt: null,
};

describe("seed", () => {
  it("is deterministic and case-insensitive", () => {
    expect(repoSeed("Lma0", "Shell-Pet")).toBe(repoSeed("lma0", "shell-pet"));
    expect(traitsFromSeed(repoSeed("a", "b"))).toEqual(traitsFromSeed(repoSeed("a", "b")));
    expect(cyrb53("a")).not.toBe(cyrb53("b"));
  });
  it("shiny is 1 in 512", () => {
    expect(isShiny(512 * 7)).toBe(true);
    expect(isShiny(512 * 7 + 1)).toBe(false);
    let n = 0;
    for (let i = 0; i < 51200; i++) if (isShiny(repoSeed("u", String(i)))) n++;
    expect(n).toBeGreaterThan(60);
    expect(n).toBeLessThan(140);
  });
});

describe("stage", () => {
  it.each([
    [0, "egg"],
    [1, "juvenile"],
    [19, "juvenile"],
    [20, "adult"],
    [299, "adult"],
    [300, "elder"],
  ])("%i stars → %s", (stars, stage) => {
    expect(stageFor({ stars, archived: false, daysSinceCommit: 1 })).toBe(stage);
  });
  it("rests when archived or 180 days quiet, never abandons", () => {
    expect(stageFor({ stars: 5000, archived: true, daysSinceCommit: 1 })).toBe("resting");
    expect(stageFor({ stars: 5000, archived: false, daysSinceCommit: 180 })).toBe("resting");
    expect(stageFor({ stars: 5000, archived: false, daysSinceCommit: 179 })).toBe("elder");
    expect(stageFor({ stars: 0, archived: true, daysSinceCommit: 400 })).toBe("egg");
  });
  it("grows the shell with stars and releases", () => {
    expect(shellScale("adult", 290)).toBeGreaterThan(shellScale("adult", 25));
    expect(shellScale("adult", 100, 3)).toBeGreaterThan(shellScale("adult", 100, 0));
    expect(shellScale("resting", 100)).toBe(shellScale("adult", 100));
  });
});

describe("mood (first match wins)", () => {
  it("celebrates releases and merged PRs", () => {
    expect(moodFor({ ...quiet, lastReleaseAt: ago(0.5), oldestUnansweredIssueAt: ago(40) })).toBe("celebrating");
    expect(moodFor({ ...quiet, mergedLastDay: 2 })).toBe("celebrating");
  });
  it("is grateful for stars today or yesterday", () => {
    expect(moodFor({ ...quiet, lastStarDayAt: ago(1.5) })).toBe("grateful");
    expect(moodFor({ ...quiet, lastStarDayAt: ago(2.5) })).not.toBe("grateful");
  });
  it("is anxious only about issues waiting for a reply", () => {
    const r = moodWithReason({ ...quiet, oldestUnansweredIssueAt: ago(16) });
    expect(r.mood).toBe("anxious");
    expect(r.reason).toBe("An open issue has had no reply for 16 days.");
  });
  it("is curious about forks and first-time contributors", () => {
    expect(moodFor({ ...quiet, lastForkAt: ago(2) })).toBe("curious");
    expect(moodFor({ ...quiet, lastFirstTimeContributorAt: ago(3) })).toBe("curious");
  });
  it("is happy with recent commits", () => expect(moodFor({ ...quiet, lastCommitAt: ago(2) })).toBe("happy"));
  it("is lonely only for a user's repo with no outside activity", () => {
    const alone = { ...quiet, starsLast60d: 0, outsideLast60d: 0 };
    expect(moodFor(alone)).toBe("lonely");
    expect(moodFor({ ...alone, ownerIsUser: false })).toBe("happy");
    expect(moodFor({ ...alone, starsLast60d: 1 })).toBe("happy");
  });
  it("sleeps when quiet", () => {
    expect(moodFor({ ...quiet, lastCommitAt: ago(45) })).toBe("sleepy");
    expect(moodFor({ ...quiet, lastCommitAt: ago(120) })).toBe("sleeping");
  });
});

describe("github helpers", () => {
  it("reads the last page from a Link header", () => {
    const link = '<https://api.github.com/x?per_page=1&page=2>; rel="next", <https://api.github.com/x?per_page=1&page=347>; rel="last"';
    expect(lastPageFromLink(link)).toBe(347);
    expect(lastPageFromLink(null)).toBeNull();
  });
  it("counts distinct major versions, including bare v2 tags", () => {
    expect(countMajorVersions(["v1.0.0", "v1.2.0", "2.0.0", "v3", "nightly"])).toBe(3);
  });
  it("summarizes daily star history", () => {
    const week = Math.floor(ago(3).getTime() / 1000);
    const s = summarizeStarHistory([{ week, days: [2, 0, 1, 0, 0, 0, 0] }], now, ago(60));
    expect(s.stars).toBe(3);
    expect(s.lastStarDayAt).toBe(new Date((week + 2 * 86_400) * 1000).toISOString());
    expect(summarizeStarHistory([], now, ago(60))).toEqual({ lastStarDayAt: null, stars: 0 });
  });
  it("maps languages to shells", () => {
    expect(languageShell("C")).toBe("cpp");
    expect(languageShell("Kotlin")).toBeNull();
  });
});

describe("repo names", () => {
  it("accepts real GitHub names, including dot-prefixed repos", () => {
    expect(validRepoName("octocat", ".github")).toBe(true);
    expect(validRepoName("my-org", "a.b_c-d")).toBe(true);
  });
  it("rejects invalid owners and repos", () => {
    expect(validRepoName("-bad", "x")).toBe(false);
    expect(validRepoName("a--b", "x")).toBe(false);
    expect(validRepoName("o", "..")).toBe(false);
    expect(validRepoName("o", "a/b")).toBe(false);
    expect(validRepoName("x".repeat(40), "r")).toBe(false);
  });
  it("parses input in every common form", () => {
    for (const s of ["vercel/next.js", "https://github.com/vercel/next.js", "github.com/vercel/next.js/tree/canary", "git@github.com:vercel/next.js.git"]) {
      expect(parseRepoInput(s)).toEqual({ owner: "vercel", repo: "next.js" });
    }
    expect(parseRepoInput("https://notgithub.com/a/b")).toBeNull();
  });
});
