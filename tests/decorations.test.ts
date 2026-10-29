import { describe, expect, it } from "vitest";
import { ART } from "@/svg/art/assets";
import slots from "@/svg/art/decoration-slots.json";

describe("shell decoration clearance", () => {
  it("covers every shell and preserves the terminal screen", () => {
    expect(Object.keys(slots).sort()).toEqual(Object.keys(ART.shells).sort());
    for (const [name, points] of Object.entries(slots)) {
      // The dark terminal has no sticker surface; leave its cursor readable.
      const count = name === "bash" ? 0 : 8;
      expect(points).toHaveLength(count);
      expect(new Set(points.map(p => p.join(","))).size).toBe(count);
    }
  });
  it("keeps the complete sticker left of the head at every shell growth size", () => {
    for (const points of Object.values(slots)) {
      for (const [x, y] of points) {
        for (const growth of [0.86, 1, 1.14]) {
          expect(95 + (x + 7.5 - 95) * growth).toBeLessThan(120);
        }
        expect(y).toBeLessThanOrEqual(110);
      }
    }
  });
});
