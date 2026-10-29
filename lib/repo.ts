// One place for "is this a GitHub owner/repo?", shared by the badge route and the website.

/** GitHub usernames and org names: letters, digits and single hyphens, 1–39 chars, no leading/trailing hyphen. */
const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
/** Repo names: letters, digits, `.`, `-`, `_`, up to 100 chars. Dot-prefixed names like `.github` are allowed. */
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

export function validOwner(owner: string): boolean {
  return OWNER.test(owner);
}

export function validRepo(repo: string): boolean {
  return REPO.test(repo) && repo !== "." && repo !== "..";
}

export function validRepoName(owner: string, repo: string): boolean {
  return validOwner(owner) && validRepo(repo);
}

/** Accepts `owner/repo`, a github.com URL, or a clone URL. Returns null for anything else. */
export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const s = input.trim().replace(/\/+$/, "");
  const m =
    s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s?#]+?)(?:\.git)?(?:[/?#].*)?$/i) ??
    s.match(/^git@github\.com:([^/\s]+)\/([^/\s]+?)(?:\.git)?$/i) ??
    s.match(/^([^/\s:]+)\/([^/\s]+)$/);
  if (!m) return null;
  const [, owner, repo] = m;
  return validRepoName(owner, repo) ? { owner, repo } : null;
}
