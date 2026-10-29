import { afterEach, describe, expect, it, vi } from "vitest";
import DevLayout from "@/app/dev/layout";

afterEach(() => { vi.unstubAllEnvs(); });

describe("development pages", () => {
  it("returns 404 in production for the entire /dev subtree", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => DevLayout({ children: "inspection page" })).toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
  it("keeps the inspection pages available during local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(DevLayout({ children: "inspection page" })).toBe("inspection page");
  });
});
