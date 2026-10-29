import type { PetState } from "@/svg/render";
import type { RepoStats } from "./github";
import { daysSince, moodFor } from "./mood";
import { repoSeed } from "./seed";
import { stageFor } from "./stage";
import { traitsFromSeed } from "./traits";

/** Pure: GitHub stats → everything the renderer needs. */
export function petFromStats(stats: RepoStats): PetState {
  const a = stats.activity;
  const daysSinceCommit = a.lastCommitAt ? daysSince(a.now, a.lastCommitAt) : null;
  return {
    owner: stats.owner,
    repo: stats.repo,
    traits: traitsFromSeed(repoSeed(stats.owner, stats.repo)),
    stage: stageFor({ stars: stats.stars, archived: stats.archived, daysSinceCommit }),
    mood: moodFor(a),
    language: stats.language,
    stars: stats.stars,
    contributors: stats.contributors,
    majorReleases: stats.majorReleases,
    recentStar: daysSince(a.now, a.lastStarAt) < 3,
  };
}

const NAME = /^[A-Za-z0-9_.-]{1,100}$/;

export function validRepoName(owner: string, repo: string): boolean {
  return NAME.test(owner) && NAME.test(repo) && owner.length <= 39 && !repo.startsWith(".");
}

