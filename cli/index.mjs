#!/usr/bin/env node
// npx shell-pet init [--square] [--readme path] [--dry-run]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ORIGIN = process.env.SHELL_PET_ORIGIN ?? "https://shell-pet.vercel.app";
const START = "<!-- shell-pet -->";
const END = "<!-- /shell-pet -->";

export function parseRemote(url) {
  const m = url.trim().match(/github\.com[:/]([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i);
  return m ? { owner: m[1], repo: m[2] } : null;
}

export function snippet({ owner, repo }, square = false) {
  const q = square ? "?layout=square" : "";
  return `${START}\n[![shell-pet](${ORIGIN}/api/pet/${owner}/${repo}.svg${q})](https://github.com/${owner}/${repo})\n${END}`;
}

/** Replace an existing block, else insert after the first H1, else at the top. */
export function insert(readme, block) {
  const existing = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (existing.test(readme)) return readme.replace(existing, block);
  const h1 = readme.match(/^# .*$/m);
  if (h1) {
    const at = h1.index + h1[0].length;
    return `${readme.slice(0, at)}\n\n${block}\n${readme.slice(at).replace(/^\n+/, "\n")}`;
  }
  return `${block}\n\n${readme}`;
}

function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd !== "init") {
    console.log("Usage: npx shell-pet init [--square] [--readme README.md] [--dry-run]");
    process.exit(cmd ? 1 : 0);
  }
  const square = rest.includes("--square");
  const dry = rest.includes("--dry-run");
  const ri = rest.indexOf("--readme");
  const path = ri >= 0 ? rest[ri + 1] : "README.md";

  let remote;
  try {
    remote = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" });
  } catch {
    console.error("shell-pet: no git remote named 'origin' here. Run this inside a GitHub repository.");
    process.exit(1);
  }
  const repo = parseRemote(remote);
  if (!repo) {
    console.error(`shell-pet: origin isn't a GitHub URL (${remote.trim()}).`);
    process.exit(1);
  }

  const before = existsSync(path) ? readFileSync(path, "utf8") : `# ${repo.repo}\n`;
  const after = insert(before, snippet(repo, square));
  if (dry) {
    process.stdout.write(after);
    return;
  }
  writeFileSync(path, after);
  console.log(`🦀 Added a crab for ${repo.owner}/${repo.repo} to ${path}. Commit it and star your repo to feed it.`);
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main(process.argv.slice(2));
