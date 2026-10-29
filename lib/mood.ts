export const MOODS = [
  "celebrating",
  "grateful",
  "anxious",
  "curious",
  "happy",
  "lonely",
  "sleepy",
  "sleeping",
] as const;
export type Mood = (typeof MOODS)[number];

export interface Activity {
  now: Date;
  lastCommitAt: Date | null;
  lastReleaseAt: Date | null;
  /** PRs merged in the 24h before the data was fetched. */
  mergedLastDay: number;
  /** Start of the latest day with new stars (day buckets, not exact times). */
  lastStarDayAt: Date | null;
  starsLast60d: number;
  lastForkAt: Date | null;
  lastFirstTimeContributorAt: Date | null;
  /** Issues/PRs opened by people other than the owner in the last 60 days. */
  outsideLast60d: number;
  /** Only user-owned repos can be lonely: for an org there is no single "owner" doing the work. */
  ownerIsUser: boolean;
  /** Oldest open issue with no comments, if it's at least 14 days old. */
  oldestUnansweredIssueAt: Date | null;
}

const DAY = 86_400_000;

export function daysSince(now: Date, d: Date | null): number {
  return d ? (now.getTime() - d.getTime()) / DAY : Infinity;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const days = (n: number) => plural(Math.floor(n), "day");

/**
 * First matching rule wins. Returns the mood and a one-line reason a person can read.
 *
 * | Mood        | When                                                                      |
 * | ----------- | ------------------------------------------------------------------------- |
 * | celebrating | a release, or a merged PR, in the last day                                |
 * | grateful    | new stars today or yesterday                                              |
 * | anxious     | an open issue has had no reply for 14+ days                               |
 * | curious     | a new fork or a first-time contributor's PR in the last 7 days            |
 * | happy       | a commit in the last 7 days                                               |
 * | lonely      | a user's repo, committed to in 60 days, with no outside stars/issues/PRs  |
 * | sleepy      | no commits for 30–89 days                                                 |
 * | sleeping    | no commits for 90+ days (180+ days or archived shows the Resting stage)   |
 * | happy       | anything else (e.g. last commit 7–29 days ago with outside activity)      |
 */
export function moodWithReason(a: Activity): { mood: Mood; reason: string } {
  const since = (d: Date | null) => daysSince(a.now, d);
  const commitDays = since(a.lastCommitAt);

  if (since(a.lastReleaseAt) < 1) return { mood: "celebrating", reason: "A new release came out today." };
  if (a.mergedLastDay > 0) return { mood: "celebrating", reason: `${plural(a.mergedLastDay, "pull request")} merged in the last day.` };
  if (since(a.lastStarDayAt) < 2) return { mood: "grateful", reason: "Someone starred the repo today or yesterday." };
  if (a.oldestUnansweredIssueAt) {
    return { mood: "anxious", reason: `An open issue has had no reply for ${days(since(a.oldestUnansweredIssueAt))}.` };
  }
  if (since(a.lastForkAt) < 7) return { mood: "curious", reason: "Someone forked the repo this week." };
  if (since(a.lastFirstTimeContributorAt) < 7) return { mood: "curious", reason: "A first-time contributor opened a pull request this week." };
  if (commitDays < 7) return { mood: "happy", reason: "There's been a commit this week." };
  if (a.ownerIsUser && commitDays < 60 && a.starsLast60d === 0 && a.outsideLast60d === 0) {
    return { mood: "lonely", reason: "Only the owner has visited in the last 60 days." };
  }
  if (commitDays >= 90) return { mood: "sleeping", reason: `No commits for ${days(commitDays)}.` };
  if (commitDays >= 30) return { mood: "sleepy", reason: `No commits for ${days(commitDays)}.` };
  return { mood: "happy", reason: "Things are ticking along." };
}

export function moodFor(a: Activity): Mood {
  return moodWithReason(a).mood;
}

export function moodLabel(mood: Mood): string {
  return mood[0].toUpperCase() + mood.slice(1);
}
