export const STAGES = ["egg", "juvenile", "adult", "elder", "resting"] as const;
export type Stage = (typeof STAGES)[number];

export const RESTING_AFTER_DAYS = 180;

export interface StageInput {
  stars: number;
  archived: boolean;
  /** Days since the last commit (null = unknown, treated as active). */
  daysSinceCommit: number | null;
}

/** Size stage from stars alone; also decides how big a resting crab's shell is. */
export function growthStage(stars: number): Exclude<Stage, "resting"> {
  if (stars <= 0) return "egg";
  if (stars < 20) return "juvenile";
  if (stars < 300) return "adult";
  return "elder";
}

/** Archived or long-quiet repos rest. Finished projects aren't punished: the crab just naps. */
export function stageFor({ stars, archived, daysSinceCommit }: StageInput): Stage {
  const growth = growthStage(stars);
  if (growth !== "egg" && (archived || (daysSinceCommit !== null && daysSinceCommit >= RESTING_AFTER_DAYS))) return "resting";
  return growth;
}

// [min stars, max stars, min scale, max scale] per shelled stage.
const SHELL_RANGES: Record<"juvenile" | "adult" | "elder", [number, number, number, number]> = {
  juvenile: [1, 20, 0.7, 0.84],
  adult: [20, 300, 0.9, 1.0],
  elder: [300, 100000, 1.04, 1.12],
};

/**
 * Shell scale grows smoothly with log(stars) inside each stage.
 * Each distinct major release adds a little extra growth.
 */
export function shellScale(stage: Stage, stars: number, majorReleases = 0): number {
  const growth = stage === "resting" ? growthStage(stars) : stage;
  if (growth === "egg") return 0;
  const [lo, hi, sLo, sHi] = SHELL_RANGES[growth];
  const t = Math.min(1, Math.max(0, (Math.log(Math.max(stars, lo)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))));
  const releaseBonus = Math.min(majorReleases, 5) * 0.012;
  return +(sLo + (sHi - sLo) * t + releaseBonus).toFixed(3);
}

export function stageLabel(stage: Stage): string {
  return stage[0].toUpperCase() + stage.slice(1);
}
