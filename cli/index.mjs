#!/usr/bin/env node
// npx shell-pet init [--square] [--readme path] [--dry-run]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ORIGIN = process.env.SHELL_PET_ORIGIN ?? "https://shell-pet.vercel.app";
const START = "<!-- shell-pet -->";
const END = "<!-- /shell-pet -->";
const USAGE = "Usage: npx shell-pet init [--square] [--readme README.md] [--dry-run]";

const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

/** GitHub remotes only: https://github.com/o/r(.git), git@github.com:o/r(.git), ssh://git@github.com/o/r(.git). */
export function parseRemote(url) {
  const s = url.trim();
  const m =
    s.match(/^https?:\/\/(?:[^@/\s]+@)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i) ??
    s.match(/^(?:ssh:\/\/)?git@github\.com[:/]([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  const [, owner, repo] = m;
  return OWNER.test(owner) && REPO.test(repo) && repo !== "." && repo !== ".." ? { owner, repo } : null;
}

export function snippet({ owner, repo }, square = false) {
  const q = square ? "?layout=square" : "";
  return `${START}\n[![shell-pet](${ORIGIN}/api/pet/${owner}/${repo}.svg${q})](https://github.com/${owner}/${repo})\n${END}`;
}

export class ReadmeError extends Error {}

/** Index ranges of fenced code blocks (``` or ~~~), so headings and markers inside examples are ignored. */
function fences(text) {
  const ranges = [];
  const re = /^ {0,3}(`{3,}|~{3,})[^\n]*$/gm;
  let open = null;
  let m;
  while ((m = re.exec(text))) {
    if (!open) open = { start: m.index, mark: m[1] };
    else if (m[1][0] === open.mark[0] && m[1].length >= open.mark.length) {
      ranges.push([open.start, m.index + m[0].length]);
      open = null;
    }
  }
  if (open) ranges.push([open.start, text.length]);
  return ranges;
}

const inFence = (ranges, i) => ranges.some(([a, b]) => i >= a && i < b);

function findOutside(text, re, ranges) {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = g.exec(text))) if (!inFence(ranges, m.index)) return m;
  return null;
}

/**
 * Replace an existing badge block; otherwise insert after the first H1, otherwise after YAML front matter,
 * otherwise at the top. Headings and markers inside code fences are ignored.
 */
export function insert(readme, block) {
  const ranges = fences(readme);
  const start = findOutside(readme, /<!-- shell-pet -->/, ranges);
  const end = findOutside(readme, /<!-- \/shell-pet -->/, ranges);
  if (start || end) {
    if (!start || !end || end.index < start.index) {
      throw new ReadmeError("found only part of a shell-pet block (<!-- shell-pet --> … <!-- /shell-pet -->). Fix or remove it, then run again.");
    }
    return readme.slice(0, start.index) + block + readme.slice(end.index + END.length);
  }
  const h1 = findOutside(readme, /^# .*$/m, ranges);
  if (h1) {
    const at = h1.index + h1[0].length;
    return `${readme.slice(0, at)}\n\n${block}\n${readme.slice(at).replace(/^\n+/, "\n")}`;
  }
  const front = readme.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (front) {
    const at = front[0].length;
    return `${readme.slice(0, at)}\n${block}\n\n${readme.slice(at).replace(/^\n+/, "")}`;
  }
  return `${block}\n\n${readme}`;
}

/** Parse `init` flags strictly; returns options or throws with a message for the user. */
export function parseArgs(args) {
  const opts = { square: false, dry: false, readme: "README.md" };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--square") opts.square = true;
    else if (a === "--dry-run") opts.dry = true;
    else if (a === "--readme") {
      const v = args[++i];
      if (!v || v.startsWith("--")) throw new Error("--readme needs a file path, e.g. --readme docs/README.md");
      opts.readme = v;
    } else throw new Error(`unknown option ${a}`);
  }
  return opts;
}

function fail(msg) {
  console.error(`shell-pet: ${msg}`);
  process.exit(1);
}

function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === undefined || cmd === "--help" || cmd === "-h") {
    console.log(USAGE);
    return;
  }
  if (cmd !== "init") fail(`unknown command "${cmd}".\n${USAGE}`);
  let opts;
  try {
    opts = parseArgs(rest);
  } catch (e) {
    fail(`${e.message}\n${USAGE}`);
  }

  let remote;
  try {
    remote = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    fail("no git remote named 'origin' here. Run this inside a GitHub repository.");
  }
  const repo = parseRemote(remote);
  if (!repo) fail(`origin isn't a GitHub repository URL (${remote.trim()}).`);

  const path = opts.readme;
  const before = existsSync(path) ? readFileSync(path, "utf8") : `# ${repo.repo}\n`;
  let after;
  try {
    after = insert(before, snippet(repo, opts.square));
  } catch (e) {
    fail(`${path}: ${e.message}`);
  }
  if (opts.dry) {
    process.stdout.write(after);
    return;
  }
  if (after === before) {
    console.log(`🦀 ${path} already has this crab. Nothing to change.`);
    return;
  }
  const updating = findOutside(before, /<!-- shell-pet -->/, fences(before)) !== null;
  writeFileSync(path, after);
  console.log(
    updating
      ? `🦀 Updated the crab for ${repo.owner}/${repo.repo} in ${path}.`
      : `🦀 Added a crab for ${repo.owner}/${repo.repo} to ${path}. Commit it and star your repo to feed it.`,
  );
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main(process.argv.slice(2));
