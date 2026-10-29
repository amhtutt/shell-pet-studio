import { createRng, pick } from "./seed";

// Body colors (the art is recolored to these by scripts/build-art.py); band = default shell band.
export const BODY_COLORS = {
  coral: { base: "#F2734F", shadow: "#D95B3B", band: "#E8A36F" },
  teal: { base: "#3EBFB4", shadow: "#2A9E94", band: "#F2B38A" },
  lilac: { base: "#B08ED9", shadow: "#9471C2", band: "#A27BD1" },
  mint: { base: "#8ED39A", shadow: "#6FB97C", band: "#D9B98C" },
  peach: { base: "#F8A06A", shadow: "#E3844E", band: "#B89BE0" },
  sky: { base: "#6BB8EC", shadow: "#4D9CD3", band: "#8CCBEF" },
  sand: { base: "#CFA77C", shadow: "#B58B60", band: "#9FD3C0" },
  rose: { base: "#F07C93", shadow: "#D9627A", band: "#F2B38A" },
} as const;

export type BodyColor = keyof typeof BODY_COLORS;
export const BODY_COLOR_NAMES = Object.keys(BODY_COLORS) as BodyColor[];

export const GENERIC_SHELLS = ["spiral", "conch", "round", "cone"] as const;
export type GenericShell = (typeof GENERIC_SHELLS)[number];

export const DECORATIONS = ["barnacle", "star", "flower", "heart", "pebble"] as const;
export type Decoration = (typeof DECORATIONS)[number];

export const GIFTS = ["shell", "star"] as const;
export type Gift = (typeof GIFTS)[number];

export interface Traits {
  seed: number;
  shiny: boolean;
  bodyColor: BodyColor;
  genericShell: GenericShell;
  /** Eight decorations in display order; the first N are shown for N contributors. */
  decorations: Decoration[];
  gifts: [Gift, Gift];
  giftCount: 1 | 2;
}

export function isShiny(seed: number): boolean {
  return seed % 512 === 0;
}

export function traitsFromSeed(seed: number): Traits {
  // Draw order is part of the contract: changing it re-rolls every crab.
  const rng = createRng(seed);
  const bodyColor = pick(rng, BODY_COLOR_NAMES);
  const genericShell = pick(rng, GENERIC_SHELLS);
  const decorations = Array.from({ length: 8 }, () => pick(rng, DECORATIONS));
  const gifts: [Gift, Gift] = [pick(rng, GIFTS), pick(rng, GIFTS)];
  const giftCount = rng() < 0.5 ? 1 : 2;
  return {
    seed,
    shiny: isShiny(seed),
    bodyColor,
    genericShell,
    decorations,
    gifts,
    giftCount,
  };
}


