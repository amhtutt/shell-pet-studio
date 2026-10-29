import { render } from '../svg/render';
import { growthStage } from '../lib/stage';
import { MOODS } from '../lib/mood';
import { DEFAULT_REPO, demoPet, markdownFor, parseRepository, STARS, MOOD_RULES, badgeURL, previewURL, badgeMetadata, statusMessage } from './demo';

export function initializeStudio(root, config = {}) {
const $ = s => root.querySelector(s);

const apiOrigin = config.apiOrigin ?? '';
const markdownOrigin = config.badgeOrigin || 'https://shell-pet.vercel.app';
let repository = { ...DEFAULT_REPO };
const options = { layout: 'wide', theme: 'light', size: 'lg' };
const settings = { stage: 'adult', mood: 'happy', language: null, stars: STARS.adult, contributors: 3, releases: 1, shiny: false, gift: false };
let liveController, liveVersion = 0, toastTimer;
const title = s => s[0].toUpperCase() + s.slice(1);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollTo = selector => $(selector).scrollIntoView({ behavior: reduceMotion() ? 'instant' : 'smooth' });
function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}
async function loadLiveBadge() {
  liveController?.abort();
  const controller = new AbortController(); liveController = controller;
  const version = ++liveVersion;
  const timeout = setTimeout(() => controller.abort(), 15000);
  const image = $('#badge-preview');
  const url = badgeURL(repository, options, apiOrigin);
  $('#live-reason').textContent = 'Checking the live repository badge…';
  $('#live-status').dataset.status = 'loading'; $('#live-fetched').textContent = ''; $('#live-retry').hidden = true;
  image.alt = `Live shell-pet badge for ${repository.owner}/${repository.repo}`;
  image.onload = () => { if (version === liveVersion) $('#badge-stage').classList.remove('image-loading'); };
  image.onerror = () => {
    if (version !== liveVersion) return;
    $('#badge-stage').classList.remove('image-loading');
    $('#live-reason').textContent = 'The live badge image could not load. Please try again shortly.';
    $('#live-status').dataset.status = 'unavailable'; $('#live-retry').hidden = false;
  };
  $('#badge-stage').classList.add('image-loading'); image.src = url;
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
    if (version !== liveVersion) return;
    if (!response.ok || !response.headers.get('content-type')?.includes('image/svg+xml')) throw new Error('Badge metadata unavailable');
    const meta = badgeMetadata(response);
    $('#live-status').dataset.status = meta.status; $('#live-reason').textContent = statusMessage(meta);
    $('#live-retry').hidden = !['missing', 'unavailable', 'unknown'].includes(meta.status);
    if (meta.fetchedAt) {
      $('#live-fetched').dateTime = meta.fetchedAt;
      $('#live-fetched').textContent = `Data fetched ${new Date(meta.fetchedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`;
    }
  } catch {
    if (version !== liveVersion) return;
    $('#live-status').dataset.status = 'unknown'; $('#live-reason').textContent = statusMessage({ status: 'unknown' }); $('#live-retry').hidden = false;
  } finally { clearTimeout(timeout); }
}
function updateDemo() {
  $('#demo-preview').src = previewURL(repository, settings, options, apiOrigin);
  $('#demo-preview').alt = `Demo snapshot for ${repository.owner}/${repository.repo}: ${title(settings.stage)}, ${title(settings.mood)}${settings.language ? `, ${settings.language} shell` : ''}`;
  $('#demo-caption').textContent = settings.stage === 'resting' ? 'Resting: archived, or no commits for 180+ days. The crab naps with a nightcap; eggs stay eggs.' : `${title(settings.mood)}: ${MOOD_RULES[settings.mood]}`;
  $('#demo-stage').classList.toggle('dark', options.theme === 'dark'); $('#demo-stage').classList.toggle('square', options.layout === 'square');
  for (const [id, value] of [['stage-select', settings.stage], ['mood-select', settings.mood], ['shell-select', settings.language || ''], ['stars-input', settings.stars], ['contributors-input', settings.contributors], ['releases-input', settings.releases]]) $('#' + id).value = value;
  $('#gift-input').checked = settings.gift;
  $('#shiny-button').setAttribute('aria-pressed', String(settings.shiny));
  $('#shiny-button').innerHTML = `<span aria-hidden="true">✦</span> ${settings.shiny ? 'Shiny on' : 'Try shiny'}`;
}
function updateDisplay() {
  $('#markdown-code').textContent = markdownFor(repository, options.layout, options.theme, markdownOrigin);
  $('#badge-stage').classList.toggle('dark', options.theme === 'dark'); $('#badge-stage').classList.toggle('square', options.layout === 'square');
  $('#badge-preview').width = options.layout === 'wide' ? 640 : 240; $('#badge-preview').height = options.layout === 'wide' ? 160 : 240;
  for (const key of ['layout', 'theme']) root.querySelectorAll(`[data-${key}]`).forEach(button => {
    const active = button.dataset[key] === options[key]; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  updateDemo(); loadLiveBadge();
}
$('#repo-form').addEventListener('submit', event => {
  event.preventDefault(); const parsed = parseRepository($('#repo-input').value);
  if (!parsed) {
    $('#repo-error').textContent = 'Use owner/repository or a GitHub URL. Dot-prefixed repositories such as owner/.github work too.';
    $('#repo-error').hidden = false; $('#repo-input').setAttribute('aria-invalid', 'true'); $('#repo-input').focus(); return;
  }
  $('#repo-error').hidden = true; $('#repo-input').removeAttribute('aria-invalid'); repository = parsed;
  $('#repo-input').value = `${parsed.owner}/${parsed.repo}`; updateDisplay();
});
$('#repo-input').addEventListener('input', () => { $('#repo-error').hidden = true; $('#repo-input').removeAttribute('aria-invalid'); });
$('#live-retry').addEventListener('click', loadLiveBadge);
for (const key of ['layout', 'theme']) root.querySelectorAll(`[data-${key}]`).forEach(button => button.addEventListener('click', () => { options[key] = button.dataset[key]; updateDisplay(); }));
$('#stage-select').addEventListener('change', e => { settings.stage = e.target.value; settings.stars = STARS[settings.stage]; updateDemo(); });
$('#mood-select').addEventListener('change', e => { settings.mood = e.target.value; updateDemo(); });
$('#shell-select').addEventListener('change', e => { settings.language = e.target.value || null; updateDemo(); });
$('#shiny-button').addEventListener('click', () => { settings.shiny = !settings.shiny; updateDemo(); });
$('#gift-input').addEventListener('change', e => { settings.gift = e.target.checked; updateDemo(); });
for (const [id, key, max] of [['stars-input', 'stars', 10_000_000], ['contributors-input', 'contributors', 100_000], ['releases-input', 'releases', 1000]]) $('#' + id).addEventListener('change', e => {
  const value = Number(e.target.value); settings[key] = Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
  if (key === 'stars') settings.stage = settings.stage === 'resting' && settings.stars > 0 ? 'resting' : growthStage(settings.stars);
  updateDemo();
});
async function copy(text, code, label) {
  try { await navigator.clipboard.writeText(text); toast(`${label} copied.`); }
  catch {
    const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    code.parentElement.focus(); toast('Clipboard unavailable. Text is selected — press ⌘C or Ctrl+C.');
  }
}
$('#copy-button').addEventListener('click', () => copy(markdownFor(repository, options.layout, options.theme, markdownOrigin), $('#markdown-code'), 'Markdown'));
$('#copy-cli').addEventListener('click', () => copy('npx shell-pet init', $('#cli-command'), 'CLI command'));
$('#download-button').addEventListener('click', async () => {
  const button = $('#download-button'); const snapshot = { repository: { ...repository }, settings: { ...settings }, options: { ...options } }; button.disabled = true;
  try {
    const url = previewURL(snapshot.repository, snapshot.settings, snapshot.options, apiOrigin);
    const response = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(15000) });
    if (!response.ok || !response.headers.get('content-type')?.includes('image/svg+xml')) throw new Error('SVG unavailable');
    const objectURL = URL.createObjectURL(await response.blob()); const a = document.createElement('a'); a.href = objectURL;
    a.download = `${snapshot.repository.repo}-${snapshot.settings.stage}-${snapshot.settings.mood}-frozen-demo.svg`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(objectURL), 1500); toast('Frozen demo snapshot saved. It will not update from GitHub.');
  } catch { toast('Could not download the demo. Try again on the deployed site.'); }
  finally { button.disabled = false; }
});
const hero = demoPet(DEFAULT_REPO, { stage: 'adult', stars: 80, contributors: 0 });
hero.traits = { ...hero.traits, bodyColor: 'coral', genericShell: 'spiral', shiny: false };
$('#hero-crab').src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(render(hero, { layout: 'square', theme: 'light', size: 'lg' }));
const growth = [
  ['egg', '0 stars', 'A small beginning.'], ['juvenile', '1–19 stars', 'A little crab, already at home in a shell.'],
  ['adult', '20–299 stars', 'A growing shell with room for company.'], ['elder', '300+ stars', 'A bigger shell and many adventures.'],
  ['resting', 'Archived or 180+ quiet days', 'A nap in its shell, nightcap included. Eggs stay eggs.']
];
growth.forEach(([stage, threshold, description], i) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'growth-card'; button.setAttribute('aria-label', `Preview the ${title(stage)} stage`);
  button.innerHTML = `<span class="stage-number">0${i + 1}</span><img width="240" height="192" loading="lazy" alt="${title(stage)} stage example" /><h3>${title(stage)}</h3><span class="stage-threshold">${threshold}</span><p>${description}</p>`;
  button.querySelector('img').src = previewURL(DEFAULT_REPO, { stage, stars: STARS[stage], contributors: stage === 'elder' ? 8 : stage === 'adult' ? 3 : 0 }, { layout: 'square', size: 'lg' }, apiOrigin);
  button.addEventListener('click', () => { settings.stage = stage; settings.stars = STARS[stage]; updateDemo(); scrollTo('#demo'); }); $('#growth-grid').append(button);
});
function selectMood(mood, clicked = false) {
  $('#mood-pills').querySelectorAll('button').forEach(button => { const active = button.dataset.mood === mood; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  $('#mood-crab').src = previewURL(DEFAULT_REPO, { stage: 'adult', mood, contributors: 0 }, { layout: 'square', size: 'lg' }, apiOrigin);
  $('#mood-crab').alt = `${title(mood)} hermit crab example`; $('#mood-caption').textContent = MOOD_RULES[mood];
  if (clicked) { settings.mood = mood; updateDemo(); }
}
MOODS.forEach((mood, i) => {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = `${i + 1}. ${title(mood)}`; button.dataset.mood = mood;
  button.addEventListener('click', () => selectMood(mood, true)); $('#mood-pills').append(button);
  const item = document.createElement('li'); const name = document.createElement('strong'); name.textContent = title(mood) + ' — ';
  item.append(name, document.createTextNode(MOOD_RULES[mood])); $('#mood-rules').append(item);
});
selectMood('happy');
for (const [language, description] of [['TypeScript', 'Blue spiral, white stripe.'], ['Python', 'Blue and yellow coils.'], ['Rust', 'Rivets and a little iron.'], ['Go', 'A smooth cyan spiral.'], ['Ruby', 'A deep red gemstone.'], ['Shell', 'A tiny terminal home.']]) {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'shell-card'; button.setAttribute('aria-label', `Try the ${language} shell in the demo`);
  button.innerHTML = `<span class="choose-arrow" aria-hidden="true">↗</span><img width="180" height="145" loading="lazy" alt="${language} shell example" /><h3>${language}</h3><p>${description}</p>`;
  button.querySelector('img').src = previewURL(DEFAULT_REPO, { stage: 'adult', language, contributors: 0 }, { layout: 'square', size: 'lg' }, apiOrigin);
  button.addEventListener('click', () => { settings.language = language; if (settings.stage === 'egg') { settings.stage = 'juvenile'; settings.stars = STARS.juvenile; } updateDemo(); scrollTo('#demo'); }); $('#shell-grid').append(button);
}
$('#try-classic').addEventListener('click', () => { settings.language = null; updateDemo(); });
$('#explore-stages').addEventListener('click', () => $('#stage-select').focus({ preventScroll: true }));
for (const repo of ['amhtutt/shell-pet-studio', 'chalk/ansi-regex', 'sindresorhus/tempy', 'microsoft/vscode-diagnostic-tools', 'facebook/react', 'vercel/next.js', 'torvalds/linux']) {
  const parsed = parseRepository(repo); const item = document.createElement('article'); item.className = 'gallery-card';
  const link = document.createElement('a'); link.href = `https://github.com/${repo}`; link.target = '_blank'; link.rel = 'noopener noreferrer';
  const image = document.createElement('img'); image.width = 640; image.height = 160; image.loading = 'lazy'; image.alt = `Live shell-pet badge for ${repo}`; image.src = badgeURL(parsed, { layout: 'wide', theme: 'light' }, apiOrigin);
  const name = document.createElement('span'); name.textContent = repo + ' ↗'; link.append(image, name); item.append(link); $('#repo-gallery').append(item);
}
if (config.projectUrl) root.querySelectorAll('.github-link').forEach(a => { a.href = config.projectUrl; });
updateDisplay();
return () => { liveController?.abort(); liveVersion++; clearTimeout(toastTimer); };
}
