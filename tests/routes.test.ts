import { describe, expect, it } from "vitest";
import { GET as preview, OPTIONS } from "@/app/api/preview/route";

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

describe("CORS", () => {
  it("lets any site read the badge and its pet headers", () => {
    const res = preview(new Request("http://x/api/preview"));
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Expose-Headers")).toContain("X-Shell-Pet-Reason");
  });
  it("answers preflight requests", () => {
    const res = OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("GET");
  });
});
