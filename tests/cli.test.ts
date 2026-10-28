import { describe, expect, it } from "vitest";
// @ts-expect-error plain JS module
import { insert, parseRemote, snippet } from "../cli/index.mjs";

describe("cli", () => {
  it("parses ssh and https remotes", () => {
    expect(parseRemote("git@github.com:lma0/shell-pet.git\n")).toEqual({ owner: "lma0", repo: "shell-pet" });
    expect(parseRemote("https://github.com/lma0/shell-pet")).toEqual({ owner: "lma0", repo: "shell-pet" });
    expect(parseRemote("https://gitlab.com/a/b")).toBeNull();
  });
  it("inserts after the H1 and is idempotent", () => {
    const block = snippet({ owner: "a", repo: "b" });
    const once = insert("# Title\n\nHello\n", block);
    expect(once).toBe(`# Title\n\n${block}\n\nHello\n`);
    expect(insert(once, block)).toBe(once);
  });
});
