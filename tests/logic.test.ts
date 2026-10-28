import { describe, expect, it } from "vitest";
import { countMajorVersions, lastPageFromLink } from "@/lib/github";
import { languageShell } from "@/lib/languages";
import { moodFor, type Activity } from "@/lib/mood";
import { cyrb53, repoSeed } from "@/lib/seed";
import { shellScale, stageFor } from "@/lib/stage";
import { isShiny, traitsFromSeed } from "@/lib/traits";

const now = new Date("2026-10-28T12:00:00Z");
const ago = (days: number) => new Date(now.getTime() - days * 86_400_000);
const quiet: Activity = {
  now,
  lastCommitAt: ago(10),
  lastOwnerCommitAt: null,
  lastReleaseAt: null,
  lastMergedPrAt: null,
  lastStarAt: ago(200),
  lastForkAt: null,
  lastFirstTimeContributorAt: null,
  lastOutsideActivityAt: null,
  openIssues: 0,
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
    [1, "cracking"],
    [4, "cracking"],
    [5, "hatchling"],
    [24, "hatchling"],
    [25, "juvenile"],
    [199, "juvenile"],
    [200, "adult"],
    [999, "adult"],
    [1000, "elder"],
  ])("%i stars → %s", (stars, stage) => {
    expect(stageFor({ stars, archived: false, daysSinceCommit: 1 })).toBe(stage);
  });
  it("abandons archived or 180-day-quiet repos", () => {
    expect(stageFor({ stars: 5000, archived: true, daysSinceCommit: 1 })).toBe("abandoned");
    expect(stageFor({ stars: 5000, archived: false, daysSinceCommit: 180 })).toBe("abandoned");
    expect(stageFor({ stars: 5000, archived: false, daysSinceCommit: 179 })).toBe("elder");
  });
  it("grows the shell with stars and releases", () => {
    expect(shellScale("adult", 900)).toBeGreaterThan(shellScale("adult", 210));
    expect(shellScale("adult", 300, 3)).toBeGreaterThan(shellScale("adult", 300, 0));
  });
});

describe("mood (first match wins)", () => {
  it("celebrates releases and merged PRs", () => {
    expect(moodFor({ ...quiet, lastReleaseAt: ago(0.5), openIssues: 99 })).toBe("celebrating");
    expect(moodFor({ ...quiet, lastMergedPrAt: ago(0.2) })).toBe("celebrating");
  });
  it("is grateful for a fresh star", () => expect(moodFor({ ...quiet, lastStarAt: ago(0.3) })).toBe("grateful"));
  it("gets anxious about issues", () => {
    expect(moodFor({ ...quiet, openIssues: 30 })).toBe("anxious");
    expect(moodFor({ ...quiet, oldestUnansweredIssueAt: ago(15) })).toBe("anxious");
    expect(moodFor({ ...quiet, oldestUnansweredIssueAt: ago(3) })).not.toBe("anxious");
  });
  it("is curious about forks", () => expect(moodFor({ ...quiet, lastForkAt: ago(2) })).toBe("curious"));
  it("is happy with recent commits", () => expect(moodFor({ ...quiet, lastCommitAt: ago(2) })).toBe("happy"));
  it("is lonely when only the owner shows up", () =>
    expect(moodFor({ ...quiet, lastOwnerCommitAt: ago(10) })).toBe("lonely"));
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
  it("counts distinct major versions", () => {
    expect(countMajorVersions(["v1.0.0", "v1.2.0", "2.0.0", "v3.1", "nightly"])).toBe(3);
  });
  it("maps languages to shells", () => {
    expect(languageShell("C")).toBe("cpp");
    expect(languageShell("Kotlin")).toBeNull();
  });
});
