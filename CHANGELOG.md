# Changelog

## Unreleased

### Changed

- **Crabs get their shell sooner.** 0 stars is an egg; 1–19 stars is a juvenile with a shell; 20–299 adult; 300+ elder. The cracking and hatchling stages are retired.
- **Quiet repos rest instead of being abandoned.** Archived repos, and repos with no commits for 180 days, show the crab napping in its shell. There's no cobweb and no "moved out".
- **Anxious only for issues waiting on a reply.** The "30+ open issues" rule is gone, since busy, healthy projects often have many.
- **Lonely only applies to personal repos.** For an organization there isn't a single owner doing the work.
- **Star moods use GitHub's daily star history.** GitHub no longer lets apps list stargazers, so "grateful" now means new stars today or yesterday.
- **The website explains the mood** (for example "An open issue has had no reply for 16 days"), shows clear messages for missing or unavailable repos, and reserves space while badges load.
- **The gallery includes small repos**, not just famous ones.
- **Other sites can read the badge API.** The badge and preview endpoints allow cross-origin `GET` and expose the `X-Shell-Pet-*` headers.

### Fixed

- Open issues are counted exactly; open pull requests could previously be counted as issues.
- Merged PRs, unanswered issues and first-time contributors use exact GitHub searches instead of small samples.
- A GitHub outage or rate limit no longer shows "repo not found". The last known crab is kept, or a "GitHub is busy" egg if there isn't one.
- Private repositories are rejected even if the server's token can see them.
- Tall shells and jumping crabs are no longer clipped at the top of the wide badge.
- The preview endpoint no longer produces broken SVG for bad numbers like `stars=abc`.
- Dot-prefixed repositories such as `.github` are accepted.
- CLI: only real github.com remotes are accepted; YAML front matter and code blocks are left alone; unknown flags and half-finished badge blocks are reported instead of guessed at.

### Internal

- One cached snapshot per repo, shared by every badge variant: 3 GitHub requests per refresh, down from 11.
- CI runs lint, type checks, tests and a production build.
- Mocked GitHub tests cover private repos, rate limits, failed lookups and star history.

## 1.0.0

First release: the badge, the website, the gallery and `npx shell-pet init`.
