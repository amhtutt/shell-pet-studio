// Shape of the generated svg/art/assets.ts. Image values are WebP data URIs.
type Src = string;
export type Sprite = { src: Src; w: number; h: number };

export interface ArtData {
  /** Size of the shared creature frame in badge units, and the y of the crab's feet. */
  frame: { w: number; h: number; ground: number };
  /** Where the closed-eye patches go, in frame units. */
  eyeBox: { x: number; y: number; w: number; h: number };
  /** crabs[mood][bodyColor], full frame. */
  crabs: Record<string, Record<string, Src>>;
  /** blinks[mood][bodyColor], eye-box patch. Happy and celebrating have none. */
  blinks: Record<string, Record<string, Src>>;
  /** shell: the shell; back: dark fill for gaps, drawn behind the crab; band: white band to tint (generic shells). */
  shells: Record<string, { shell: Src; back: Src; band?: Src }>;
  shellMeta: Record<string, { box: number[]; slots: number[][] }>;
  stages: { egg: Src };
  props?: Record<string, Sprite>;
  decorations?: Record<string, Sprite>;
}
