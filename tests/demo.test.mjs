import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { resolve } from 'node:path';
const bundle = await build({ entryPoints: ['src/demo.js'], bundle: true, write: false, platform: 'node', format: 'esm', alias: { '@': resolve('src') } });
const { parseRepository, demoPet, markdownFor, DEFAULT_REPO } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));

test('repository input accepts names, URLs, dot repositories and clone URLs', () => {
  for (const input of ['amhtutt/shell-pet', ' https://github.com/amhtutt/shell-pet/ ', 'https://www.github.com/amhtutt/shell-pet.git', 'https://github.com/amhtutt/shell-pet?tab=readme-ov-file']) {
    assert.deepEqual(parseRepository(input), DEFAULT_REPO);
  }
  assert.deepEqual(parseRepository('amhtutt/.github'), { owner: 'amhtutt', repo: '.github' });
});
test('repository parser rejects deceptive hosts, credentials and unsafe input', () => {
  for (const input of ['', 'https://notgithub.com/a/b', 'https://github.com.evil.test/a/b', 'https://user:secret@github.com/a/b', 'https://github.com:9999/a/b', 'a/b/tree/main', '<script>/x', 'a/..', 'a/b?x', 'a--b/c']) assert.equal(parseRepository(input), null, input);
});
test('appearance is deterministic while demo overrides remain independent', () => {
  const a = demoPet({ owner: 'example', repo: 'garden' });
  assert.deepEqual(a, demoPet({ owner: 'example', repo: 'garden' }));
  assert.deepEqual(a.traits, demoPet({ owner: 'example', repo: 'garden' }, { stage: 'elder', mood: 'celebrating' }).traits);
  assert.equal(demoPet(DEFAULT_REPO).traits.bodyColor, 'coral');
});
test('Markdown points to the real API and carries supported display options only', () => {
  const s = markdownFor(DEFAULT_REPO, 'square', 'dark', 'https://example.com/');
  assert.ok(s.includes('https://example.com/api/pet/amhtutt/shell-pet.svg?layout=square&theme=dark'));
  assert.ok(s.endsWith('(https://github.com/amhtutt/shell-pet)'));
  assert.ok(!s.includes('stage='));
  assert.ok(!s.includes('mood='));
  assert.ok(!s.includes('lang='));
});

const renderBundle = await build({ entryPoints: ['src/svg/render.ts'], bundle: true, write: false, platform: 'node', format: 'esm', alias: { '@': resolve('src') } });
const { render } = await import('data:text/javascript;base64,' + Buffer.from(renderBundle.outputFiles[0].text).toString('base64'));
test('all demo stages, moods, themes and shells render self-contained SVG', () => {
  const stages = ['egg', 'cracking', 'hatchling', 'juvenile', 'adult', 'elder', 'abandoned'];
  const moods = ['happy', 'celebrating', 'grateful', 'curious', 'anxious', 'lonely', 'sleepy', 'sleeping'];
  const shells = [null, 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'Ruby', 'Swift', 'Shell'];
  for (const stage of stages) for (const mood of moods) for (const language of shells) for (const theme of ['light', 'dark']) {
    const svg = render(demoPet(DEFAULT_REPO, { stage, mood, language }), { layout: 'wide', theme });
    assert.ok(svg.startsWith('<svg'));
    assert.ok(!/NaN|Infinity|<script|href="https?:/.test(svg), `${stage}/${mood}/${language}/${theme}`);
    assert.ok(svg.includes('data:image/webp;base64,'));
  }
});
