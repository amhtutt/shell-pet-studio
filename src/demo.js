import { repoSeed } from './lib/seed';
import { traitsFromSeed } from './lib/traits';

export const DEFAULT_REPO = { owner: 'amhtutt', repo: 'shell-pet' };
export const STARS = { egg: 0, cracking: 2, hatchling: 10, juvenile: 80, adult: 450, elder: 8000, abandoned: 450 };

export function parseRepository(input) {
  let value = input.trim();
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!['github.com', 'www.github.com'].includes(url.hostname.toLowerCase()) || url.username || url.password || url.port) return null;
      value = url.pathname;
    } catch { return null; }
  }
  value = value.replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '');
  const parts = value.split('/');
  if (parts.length !== 2) return null;
  const [owner, repo] = parts;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(owner) || owner.includes('--')) return null;
  if (!/^[a-z0-9_.-]{1,100}$/i.test(repo) || ['.', '..'].includes(repo)) return null;
  return { owner, repo };
}

export function demoPet(repository, overrides = {}) {
  const seed = repoSeed(repository.owner, repository.repo);
  const traits = traitsFromSeed(seed);
  if (repository.owner.toLowerCase() === 'amhtutt' && repository.repo.toLowerCase() === 'shell-pet') {
    traits.bodyColor = 'coral';
    traits.genericShell = 'spiral';
    traits.shiny = false;
  }
  const stage = overrides.stage || 'juvenile';
  return { ...repository, traits, stage, mood: 'happy', language: null, stars: STARS[stage] ?? 450, contributors: stage === 'elder' ? 8 : stage === 'adult' ? 3 : 0, majorReleases: 1, recentStar: false, ...overrides };
}

export function markdownFor(repository, layout, theme, origin) {
  const q = new URLSearchParams();
  if (layout !== 'wide') q.set('layout', layout);
  // Match the explicit theme selected in the preview. Stage/mood/shell are demo-only.
  q.set('theme', theme);
  const query = q.toString();
  const image = `${origin.replace(/\/$/, '')}/api/pet/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}.svg${query ? '?' + query : ''}`;
  return `[![shell-pet badge for ${repository.owner}/${repository.repo}](${image})](https://github.com/${repository.owner}/${repository.repo})`;
}
