import { render } from './svg/render';
import { DEFAULT_REPO, demoPet, markdownFor, parseRepository, STARS } from './demo';

const $ = (s) => document.querySelector(s);
const config = window.SHELL_PET_CONFIG || {};
const origin = config.badgeOrigin || 'https://shell-pet.vercel.app';
let repository = { ...DEFAULT_REPO };
let options = { layout: 'wide', theme: 'light', size: 'lg' };
let settings = { stage: 'juvenile', mood: 'happy', language: null, shiny: false };
let currentSVG = '';
let toastTimer;

function imageSVG(element, svg) {
  element.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function stateFor(overrides = {}) {
  const state = demoPet(repository, { stage: settings.stage, stars: STARS[settings.stage], mood: settings.mood, language: settings.language, ...overrides });
  state.traits = { ...state.traits, shiny: settings.shiny };
  return state;
}

function toast(message) {
  const el = $('#toast');
  clearTimeout(toastTimer);
  el.textContent = message;
  el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}

function update() {
  const pet = stateFor();
  currentSVG = render(pet, options);
  imageSVG($('#badge-preview'), currentSVG);
  $('#badge-preview').alt = `Demo README badge for ${repository.owner}/${repository.repo}: ${settings.stage === 'abandoned' ? 'Resting shell' : title(settings.stage)}, ${title(settings.mood)}`;
  const stage = $('#badge-stage');
  stage.classList.toggle('dark', options.theme === 'dark');
  stage.classList.toggle('square', options.layout === 'square');
  $('#badge-preview').width = options.layout === 'wide' ? 640 : 240;
  $('#badge-preview').height = options.layout === 'wide' ? 160 : 240;
  $('#markdown-code').textContent = markdownFor(repository, options.layout, options.theme, origin);
  const shell = settings.language ? (settings.language === 'C++' ? 'Hex nut' : settings.language) : title(pet.traits.genericShell);
  $('#identity-label').textContent = `${settings.shiny ? 'Shiny' : title(pet.traits.bodyColor)} · ${shell}`;
  $('#stage-select').value = settings.stage;
  $('#mood-select').value = settings.mood;
  $('#shell-select').value = settings.language || '';
  $('#shiny-button').setAttribute('aria-pressed', String(settings.shiny));
  $('#shiny-button').innerHTML = `<span aria-hidden="true">✦</span> ${settings.shiny ? 'Shiny on' : 'Try shiny'}`;
  document.querySelectorAll('[data-layout]').forEach((button) => {
    const active = button.dataset.layout === options.layout;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-theme]').forEach((button) => {
    const active = button.dataset.theme === options.theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function title(s) { return s[0].toUpperCase() + s.slice(1); }

$('#repo-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const parsed = parseRepository($('#repo-input').value);
  const error = $('#repo-error');
  if (!parsed) {
    error.textContent = 'Use owner/repository or a GitHub repository URL, like amhtutt/shell-pet.';
    error.hidden = false;
    $('#repo-input').setAttribute('aria-invalid', 'true');
    $('#repo-input').focus();
    return;
  }
  error.hidden = true;
  $('#repo-input').removeAttribute('aria-invalid');
  repository = parsed;
  $('#repo-input').value = `${parsed.owner}/${parsed.repo}`;
  update();
  toast(`Meet ${parsed.repo}’s little resident.`);
});
$('#repo-input').addEventListener('input', () => { $('#repo-error').hidden = true; $('#repo-input').removeAttribute('aria-invalid'); });

document.querySelectorAll('[data-layout]').forEach((button) => button.addEventListener('click', () => { options.layout = button.dataset.layout; update(); }));
document.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => { options.theme = button.dataset.theme; update(); }));
$('#stage-select').addEventListener('change', (e) => { settings.stage = e.target.value; update(); });
$('#mood-select').addEventListener('change', (e) => { settings.mood = e.target.value; update(); });
$('#shell-select').addEventListener('change', (e) => { settings.language = e.target.value || null; update(); });
$('#shiny-button').addEventListener('click', () => { settings.shiny = !settings.shiny; update(); });

$('#copy-button').addEventListener('click', async () => {
  const snippet = markdownFor(repository, options.layout, options.theme, origin);
  try {
    await navigator.clipboard.writeText(snippet);
    $('#copy-button span').textContent = 'Copied!';
    toast('Copied. Your README has room for a friend.');
    setTimeout(() => { $('#copy-button span').textContent = 'Copy Markdown'; }, 2200);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('#markdown-code'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    $('#markdown-code').parentElement.focus();
    toast('Clipboard unavailable. The snippet is selected — press ⌘C or Ctrl+C.');
  }
});

$('#download-button').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([currentSVG], { type: 'image/svg+xml' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${repository.repo}-${settings.stage}-${settings.mood}-demo.svg`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast('Demo badge saved as SVG.');
});

function artPet(overrides = {}) {
  return demoPet(DEFAULT_REPO, { stage: 'adult', stars: 450, contributors: 0, ...overrides });
}
imageSVG($('#hero-crab'), render(artPet({ stage: 'adult', stars: 350 }), { layout: 'square', theme: 'light', size: 'lg' }));

const growth = [
  ['hatchling', 'Hatchling', 'New ideas. A whole world ahead.'],
  ['juvenile', 'Juvenile', 'Growing with every little milestone.'],
  ['adult', 'Adult', 'A little experience shows.'],
  ['elder', 'Elder', 'Many adventures together.']
];
growth.forEach(([stage, name, copy], i) => {
  const button = document.createElement('button');
  button.className = 'growth-card';
  button.setAttribute('aria-label', `Preview the ${name} stage`);
  button.innerHTML = `<span class="stage-number">0${i + 1}</span><img width="240" height="192" loading="lazy" alt="${name} hermit crab" /><h3>${name}</h3><p>${copy}</p>`;
  imageSVG(button.querySelector('img'), render(artPet({ stage, stars: STARS[stage], contributors: i > 1 ? (i === 3 ? 7 : 2) : 0 }), { layout: 'square', size: 'lg' }));
  button.addEventListener('click', () => { settings.stage = stage; update(); $('#adopt').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' }); toast(`${name} stage selected in the demo.`); });
  $('#growth-grid').append(button);
});

const moodDescriptions = { happy: 'A fresh commit. A good day.', celebrating: 'New release? Tiny happy dance.', curious: 'Someone new stopped by.', sleepy: 'Just resting those little eye stalks.' };
function selectMood(mood, clicked = false) {
  $('#mood-pills').querySelectorAll('button').forEach((button) => { const active = button.dataset.mood === mood; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  imageSVG($('#mood-crab'), render(artPet({ mood }), { layout: 'square', size: 'lg' }));
  $('#mood-crab').alt = `${title(mood)} hermit crab`;
  $('#mood-caption').textContent = moodDescriptions[mood];
  if (clicked) { settings.mood = mood; update(); }
}
Object.keys(moodDescriptions).forEach((mood) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = title(mood);
  button.dataset.mood = mood;
  button.addEventListener('click', () => selectMood(mood, true));
  $('#mood-pills').append(button);
});
selectMood('happy');

const shells = [
  ['TypeScript', 'Clean and consistent.'], ['Python', 'Built to explore.'], ['Rust', 'Fast and reliable.'], ['Go', 'Small. Nimble.'], ['Ruby', 'Polished and thoughtful.'], ['Shell', 'For the command line.']
];
shells.forEach(([language, copy]) => {
  const button = document.createElement('button');
  button.className = 'shell-card';
  button.setAttribute('aria-label', `Try the ${language} shell in the preview`);
  button.innerHTML = `<span class="choose-arrow" aria-hidden="true">↗</span><img width="180" height="145" loading="lazy" alt="Hermit crab with a ${language} shell" /><h3>${language}</h3><p>${copy}</p>`;
  imageSVG(button.querySelector('img'), render(artPet({ language }), { layout: 'square', size: 'lg' }));
  button.addEventListener('click', () => { settings.language = language; settings.stage = ['egg', 'cracking', 'hatchling', 'abandoned'].includes(settings.stage) ? 'adult' : settings.stage; update(); $('#adopt').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' }); toast(`${language} shell selected. Looking good.`); });
  $('#shell-grid').append(button);
});
$('#try-classic').addEventListener('click', () => { settings.language = null; update(); });
$('#explore-stages').addEventListener('click', () => { $('#stage-select').focus({ preventScroll: true }); });
function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

if (config.projectUrl) document.querySelectorAll('.github-link').forEach((a) => { a.href = config.projectUrl; });
update();
