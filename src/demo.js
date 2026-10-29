import { parseRepoInput } from '../lib/repo';
import { repoSeed } from '../lib/seed';
import { traitsFromSeed } from '../lib/traits';
export const DEFAULT_REPO = { owner: 'amhtutt', repo: 'shell-pet-studio' };
export const STARS = { egg: 0, juvenile: 8, adult: 80, elder: 2000, resting: 80 };
export const parseRepository = parseRepoInput;
export const MOOD_RULES = {
  celebrating: 'A release, or a merged PR, in the last day.',
  grateful: 'New stars today or yesterday.',
  anxious: 'An open issue has had no reply for 14+ days.',
  curious: 'A new fork or a first-time contributor’s PR in the last 7 days.',
  happy: 'A commit in the last 7 days.',
  lonely: 'A personal repo (not an org) with commits in the last 60 days but no outside stars, issues or PRs.',
  sleepy: 'No commits for 30–89 days.',
  sleeping: 'No commits for 90+ days.'
};
// Only used for the hero illustration and renderer tests. Interactive demos use /api/preview.
export function demoPet(repository, overrides = {}) {
  const stage = overrides.stage || 'adult';
  return { ...repository, traits: traitsFromSeed(repoSeed(repository.owner, repository.repo)), stage, mood: 'happy', language: null, stars: STARS[stage] ?? 80, contributors: stage === 'elder' ? 8 : stage === 'adult' ? 3 : 0, majorReleases: 1, recentStar: false, ...overrides };
}
export function badgeURL(repository, { layout = 'wide', theme = 'light', size } = {}, origin = 'https://shell-pet.vercel.app') {
  const q = new URLSearchParams({ layout, theme });
  if (size) q.set('size', size);
  return `${origin.replace(/\/$/, '')}/api/pet/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}.svg?${q}`;
}
const integer = (value, fallback, max) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.min(max, Math.floor(n)) : fallback;
};
export function previewURL(repository, settings = {}, options = {}, origin = '') {
  const stage = Object.hasOwn(STARS, settings.stage) ? settings.stage : 'adult';
  const mood = Object.hasOwn(MOOD_RULES, settings.mood) ? settings.mood : 'happy';
  const q = new URLSearchParams({ stage, mood, owner: repository.owner, repo: repository.repo, lang: settings.language || '', stars: String(integer(settings.stars ?? STARS[stage], STARS[stage], 10_000_000)), contributors: String(integer(settings.contributors ?? 3, 3, 100_000)), releases: String(integer(settings.releases ?? 1, 1, 1000)), layout: options.layout === 'wide' ? 'wide' : 'square', theme: options.theme === 'dark' ? 'dark' : 'light' });
  if (options.size) q.set('size', options.size);
  if (settings.shiny) q.set('shiny', '1');
  if (settings.gift) q.set('gift', '1');
  return `${origin.replace(/\/$/, '')}/api/preview?${q}`;
}
export function markdownFor(repository, layout, theme, origin) {
  return `[![shell-pet badge for ${repository.owner}/${repository.repo}](${badgeURL(repository, { layout, theme }, origin)})](https://github.com/${repository.owner}/${repository.repo})`;
}
export function badgeMetadata(response) {
  const raw = response.headers.get('X-Shell-Pet-Status');
  const status = ['ok', 'missing', 'unavailable'].includes(raw) ? raw : 'unknown';
  const fetched = response.headers.get('X-Shell-Pet-Fetched-At');
  return { status, reason: response.headers.get('X-Shell-Pet-Reason') || '', fetchedAt: fetched && Number.isFinite(Date.parse(fetched)) ? new Date(fetched).toISOString() : null };
}
export function statusMessage(meta) {
  if (meta.status === 'missing') return 'Repository not found or private. Private repositories are never shown.';
  if (meta.status === 'unavailable') return 'GitHub is busy. The live badge is temporarily unavailable — please try again shortly.';
  if (meta.status === 'ok') return meta.reason || 'Live repository badge. Activity details will refresh with the next snapshot.';
  return 'The live image can be viewed, but its activity details are unavailable. No demo data is shown as live activity.';
}
