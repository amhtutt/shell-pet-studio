import { describe, expect, it } from "vitest";
import { GET as preview } from "@/app/api/preview/route";

const get = (q: string) => preview(new Request(`http://x/api/preview?${q}`)).text();

describe("preview route", () => {
  it("ignores unparseable or out-of-range numbers", async () => {
    for (const q of ["stars=abc", "contributors=-5", "releases=1e9", "stars=99999999999999999999", "seed=NaN"]) {
      // Look outside the embedded image data, which is base64 and can contain any letters.
      const svg = (await get(q)).replace(/data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+/g, "");
      expect(svg).not.toMatch(/NaN|Infinity/);
    }
  });
  it("falls back to safe names", async () => {
    expect(await get("owner=<script>&repo=x")).not.toContain("<script>");
  });
});
