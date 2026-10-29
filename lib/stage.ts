export const STAGES = ["egg", "cracking", "hatchling", "juvenile", "adult", "elder", "abandoned"] as const;
export type Stage = (typeof STAGES)[number];

export const ABANDONED_AFTER_DAYS = 180;

export interface StageInput {
  stars: number;
  archived: boolean;
  /** Days since the last commit (null = unknown, treated as active). */
  daysSinceCommit: number | null;
}

export function stageFor({ stars, archived, daysSinceCommit }: StageInput): Stage {
  if (archived || (daysSinceCommit !== null && daysSinceCommit >= ABANDONED_AFTER_DAYS)) return "abandoned";
  if (stars <= 0) return "egg";
  if (stars < 5) return "cracking";
  if (stars < 25) return "hatchling";
  if (stars < 200) return "juvenile";
  if (stars < 1000) return "adult";
  return "elder";
}

// [min stars, max stars, min scale, max scale] per shelled stage.
const SHELL_RANGES: Partial<Record<Stage, [number, number, number, number]>> = {
  juvenile: [25, 200, 0.66, 0.78],
  adult: [200, 1000, 0.9, 1.0],
  elder: [1000, 100000, 1.04, 1.12],
};

/**
 * Shell scale grows smoothly with log(stars) inside each stage.
 * Each distinct major release adds a little extra growth.
 */
export function shellScale(stage: Stage, stars: number, majorReleases = 0): number {
  const range = SHELL_RANGES[stage === "abandoned" ? stageFor({ stars, archived: false, daysSinceCommit: 0 }) : stage];
  if (!range) return stage === "abandoned" ? 0.9 : 0;
  const [lo, hi, sLo, sHi] = range;
  const t = Math.min(1, Math.max(0, (Math.log(Math.max(stars, lo)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))));
  const releaseBonus = Math.min(majorReleases, 5) * 0.012;
  return +(sLo + (sHi - sLo) * t + releaseBonus).toFixed(3);
}

export function stageLabel(stage: Stage): string {
  return stage[0].toUpperCase() + stage.slice(1);
}
