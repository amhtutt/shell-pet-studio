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
  /** Most recent commit authored by the repo owner. */
  lastOwnerCommitAt: Date | null;
  lastReleaseAt: Date | null;
  lastMergedPrAt: Date | null;
  lastStarAt: Date | null;
  lastForkAt: Date | null;
  lastFirstTimeContributorAt: Date | null;
  /** Most recent issue or PR opened by someone other than the owner. */
  lastOutsideActivityAt: Date | null;
  openIssues: number;
  /** Creation date of the oldest open issue that has no replies. */
  oldestUnansweredIssueAt: Date | null;
}

const DAY = 86_400_000;

export function daysSince(now: Date, d: Date | null): number {
  return d ? (now.getTime() - d.getTime()) / DAY : Infinity;
}

/** First matching rule wins. Abandoned-stage overriding is handled by the caller. */
export function moodFor(a: Activity): Mood {
  const since = (d: Date | null) => daysSince(a.now, d);

  if (since(a.lastReleaseAt) < 1 || since(a.lastMergedPrAt) < 1) return "celebrating";
  if (since(a.lastStarAt) < 1) return "grateful";
  if (a.openIssues >= 30 || (a.oldestUnansweredIssueAt && since(a.oldestUnansweredIssueAt) >= 14)) return "anxious";
  if (since(a.lastForkAt) < 7 || since(a.lastFirstTimeContributorAt) < 7) return "curious";

  const commitDays = since(a.lastCommitAt);
  if (commitDays < 7) return "happy";
  if (since(a.lastOwnerCommitAt) < 60 && since(a.lastStarAt) >= 60 && since(a.lastOutsideActivityAt) >= 60) {
    return "lonely";
  }
  if (commitDays >= 30 && commitDays < 90) return "sleepy";
  if (commitDays >= 90 && commitDays < 180) return "sleeping";
  return "happy";
}

export function moodLabel(mood: Mood): string {
  return mood[0].toUpperCase() + mood.slice(1);
}
