import type { PetState } from "@/svg/render";
import type { RepoSnapshot } from "./github";
import { daysSince, moodWithReason, type Activity } from "./mood";
import { repoSeed } from "./seed";
import { stageFor } from "./stage";
import { traitsFromSeed } from "./traits";

const date = (s: string | null) => (s ? new Date(s) : null);

export function activityFrom(s: RepoSnapshot, now: Date): Activity {
  return {
    now,
    lastCommitAt: date(s.lastCommitAt),
    lastReleaseAt: date(s.lastReleaseAt),
    // Counted over the day before the fetch; once the snapshot is a day old it no longer counts.
    mergedLastDay: daysSince(now, new Date(s.fetchedAt)) < 1 ? s.mergedLastDay : 0,
    lastStarDayAt: date(s.lastStarDayAt),
    starsLast60d: s.starsLast60d,
    lastForkAt: date(s.lastForkAt),
    lastFirstTimeContributorAt: date(s.lastFirstTimeContributorAt),
    outsideLast60d: s.outsideLast60d,
    ownerIsUser: s.ownerIsUser,
    oldestUnansweredIssueAt: date(s.oldestUnansweredIssueAt),
  };
}

/** Pure: a cached snapshot + the current time → everything the renderer needs, plus why. */
export function petFromSnapshot(s: RepoSnapshot, now = new Date()): { pet: PetState; reason: string } {
  const a = activityFrom(s, now);
  const daysSinceCommit = a.lastCommitAt ? daysSince(now, a.lastCommitAt) : null;
  const stage = stageFor({ stars: s.stars, archived: s.archived, daysSinceCommit });
  const { mood, reason } = moodWithReason(a);
  return {
    pet: {
      owner: s.owner,
      repo: s.repo,
      traits: traitsFromSeed(repoSeed(s.owner, s.repo)),
      stage,
      mood,
      language: s.language,
      stars: s.stars,
      contributors: s.contributors,
      majorReleases: s.majorReleases,
      // Star history comes in day buckets; "within ~3 days" means the last three buckets.
      recentStar: daysSince(now, a.lastStarDayAt) < 3,
    },
    reason: stage === "resting" ? (s.archived ? "The repo is archived, so the crab is resting." : "No commits for 180+ days, so the crab is resting.") : reason,
  };
}
