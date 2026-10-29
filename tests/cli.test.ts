import { describe, expect, it } from "vitest";
import { insert, parseArgs, parseRemote, snippet } from "../cli/index.mjs";

const block = snippet({ owner: "a", repo: "b" });

describe("cli remotes", () => {
  it("parses GitHub https, ssh and scp-style remotes", () => {
    expect(parseRemote("git@github.com:lma0/shell-pet.git\n")).toEqual({ owner: "lma0", repo: "shell-pet" });
    expect(parseRemote("https://github.com/lma0/shell-pet")).toEqual({ owner: "lma0", repo: "shell-pet" });
    expect(parseRemote("ssh://git@github.com/lma0/shell-pet.git")).toEqual({ owner: "lma0", repo: "shell-pet" });
  });
  it("rejects other hosts, including look-alikes", () => {
    expect(parseRemote("https://gitlab.com/a/b")).toBeNull();
    expect(parseRemote("https://notgithub.com/a/b.git")).toBeNull();
    expect(parseRemote("git@evilgithub.com:a/b.git")).toBeNull();
  });
});

describe("cli readme editing", () => {
  it("inserts after the H1 and is idempotent", () => {
    const once = insert("# Title\n\nHello\n", block);
    expect(once).toBe(`# Title\n\n${block}\n\nHello\n`);
    expect(insert(once, block)).toBe(once);
  });
  it("keeps YAML front matter first", () => {
    const out = insert("---\ntitle: x\n---\nHello\n", block);
    expect(out.startsWith("---\ntitle: x\n---\n")).toBe(true);
    expect(out).toContain(`${block}\n\nHello`);
  });
  it("ignores headings and markers inside code fences", () => {
    const readme = "Intro\n\n```md\n# Not a title\n<!-- shell-pet -->\n```\n\n# Real title\n";
    const out = insert(readme, block);
    expect(out).toContain(`# Real title\n\n${block}`);
    expect(out).toContain("```md\n# Not a title\n<!-- shell-pet -->\n```");
  });
  it("refuses to guess with a half-finished block", () => {
    expect(() => insert("# T\n<!-- shell-pet -->\nstuff\n", block)).toThrow(/only part/);
  });
});

describe("cli flags", () => {
  it("parses known flags and rejects the rest", () => {
    expect(parseArgs(["--square", "--readme", "docs/R.md"])).toEqual({ square: true, dry: false, readme: "docs/R.md" });
    expect(() => parseArgs(["--readme"])).toThrow(/needs a file path/);
    expect(() => parseArgs(["--readme", "--square"])).toThrow(/needs a file path/);
    expect(() => parseArgs(["--sqaure"])).toThrow(/unknown option/);
  });
});
