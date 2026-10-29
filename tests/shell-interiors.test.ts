import { describe, expect, it } from "vitest";
import { ART } from "@/svg/art/assets";
import interiors from "@/svg/art/shell-interiors.json";
import { creature } from "@/svg/render";
import { traitsFromSeed } from "@/lib/traits";

function contains(path: string, x: number, y: number) {
  const values = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const points = Array.from({ length: values.length / 2 }, (_, i) => values.slice(i * 2, i * 2 + 2));
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

describe("shell aperture backing", () => {
  it("covers the reported slit under the Go shell rim throughout growth", () => {
    // This opening lies above the crab's back and used to show the beach through it.
    for (const growth of [0.86, 1, 1.14]) {
      const x = 95 + (151 - 95) * growth;
      const y = 135 + (78 - 135) * growth;
      expect(contains(interiors.go, 95 + (x - 95) / growth, 135 + (y - 135) / growth)).toBe(true);
    }
  });
  it("supplies a closed, opening-only silhouette for every shell", () => {
    expect(Object.keys(interiors).sort()).toEqual(Object.keys(ART.shells).sort());
    for (const path of Object.values(interiors)) {
      expect(path).toMatch(/^M[\d.]+ [\d.]+L.+Z$/);
      expect(path).not.toMatch(/NaN|Infinity/);
      // Outside features such as conch spikes and the mug handle stay transparent.
      expect(contains(path, 50, 80)).toBe(false);
      expect(contains(path, 100, 40)).toBe(false);
    }
  });
  it("puts the solid aperture behind the crab and shell in both size extremes", () => {
    for (const [stage, stars] of [["juvenile", 1], ["elder", 100000]] as const) {
      const { svg } = creature({ owner: "amhtutt", repo: "shell-pet-studio", traits: traitsFromSeed(42), stage,
        mood: "happy", language: "Go", stars, contributors: 8, majorReleases: 5, recentStar: false });
      expect(svg.indexOf('class="sp-shell-interior"')).toBeLessThan(svg.indexOf("<image"));
      expect(svg).toContain(interiors.go);
    }
  });
});
