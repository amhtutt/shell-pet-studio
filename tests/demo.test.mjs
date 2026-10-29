import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
async function load(entry) {
  const r = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'esm', alias: { '@': resolve('src') } });
  return import('data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64'));
}
const { parseRepository, demoPet, markdownFor, DEFAULT_REPO, badgeURL, previewURL, badgeMetadata, statusMessage, MOOD_RULES } = await load('src/demo.js');
const { stageFor, growthStage, shellScale, STAGES } = await load('src/lib/stage.ts');
const { moodFor, moodWithReason, MOODS } = await load('src/lib/mood.ts');
const { render } = await load('src/svg/render.ts');

test('all 14 shared files match the pinned GitHub blob hashes exactly', async () => {
  const manifest = JSON.parse(await readFile('shared-source.json', 'utf8'));
  assert.equal(manifest.commit, '0c83b914331c5c919da530e8a380a5860f734b50');
  assert.equal(Object.keys(manifest.files).length, 14);
  for (const [file, sha] of Object.entries(manifest.files)) {
    const bytes = await readFile(file);
    const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    assert.equal(hash, sha, file);
  }
});
test('repo inputs use the upstream parser, including .github, URLs and clone URLs', () => {
  for (const input of ['amhtutt/shell-pet', ' https://github.com/amhtutt/shell-pet/ ', 'https://www.github.com/amhtutt/shell-pet.git', 'https://github.com/amhtutt/shell-pet?tab=readme-ov-file', 'git@github.com:amhtutt/shell-pet.git']) assert.deepEqual(parseRepository(input), DEFAULT_REPO);
  assert.deepEqual(parseRepository('amhtutt/.github'), { owner: 'amhtutt', repo: '.github' });
  assert.ok(parseRepository('a'.repeat(39) + '/x'));
  for (const input of ['', 'https://notgithub.com/a/b', 'https://github.com.evil.test/a/b', 'https://user:secret@github.com/a/b', 'https://github.com:9999/a/b', '<script>/x', 'a/..', 'a/.', 'a/b?x', 'a--b/c', '-a/b', 'a-/b', 'a_b/c', 'a'.repeat(40) + '/b', 'a/' + 'b'.repeat(101)]) assert.equal(parseRepository(input), null, input);
});
for (const [stars, expected] of [[0,'egg'],[1,'juvenile'],[19,'juvenile'],[20,'adult'],[299,'adult'],[300,'elder']]) test(`${stars} stars selects ${expected}`, () => {
  assert.equal(growthStage(stars), expected);
  assert.equal(stageFor({ stars, archived: false, daysSinceCommit: 0 }), expected);
});
test('resting applies at 180 days or archival, while eggs stay eggs', () => {
  assert.deepEqual(STAGES, ['egg','juvenile','adult','elder','resting']);
  for (const stars of [1,20,300]) {
    assert.equal(stageFor({stars, archived:false, daysSinceCommit:179}),growthStage(stars));
    assert.equal(stageFor({stars, archived:false, daysSinceCommit:180}),'resting');
    assert.equal(stageFor({stars, archived:true, daysSinceCommit:0}),'resting');
  }
  assert.equal(stageFor({stars:0, archived:true, daysSinceCommit:999}),'egg');
  assert.equal(stageFor({stars:0, archived:false, daysSinceCommit:180}),'egg');
});
test('growth is continuous within stages, releases add size, and lost stars can regress stages', () => {
  for (const [stage,lo,hi] of [['juvenile',1,19],['adult',20,299],['elder',300,10000]]) {
    assert.ok(shellScale(stage,hi)>shellScale(stage,lo));
    assert.ok(shellScale(stage,lo,2)>shellScale(stage,lo,0));
  }
  assert.equal(growthStage(20),'adult'); assert.equal(growthStage(19),'juvenile');
  assert.equal(growthStage(300),'elder'); assert.equal(growthStage(299),'adult');
});
const now = new Date('2026-10-29T12:00:00Z');
const ago = days => new Date(now.getTime()-days*86400000);
const quiet = { now, lastCommitAt:ago(120), lastReleaseAt:null, mergedLastDay:0, lastStarDayAt:null, starsLast60d:0, lastForkAt:null, lastFirstTimeContributorAt:null, outsideLast60d:0, ownerIsUser:false, oldestUnansweredIssueAt:null };
test('mood captions and controls preserve upstream priority', () => {
  assert.deepEqual(Object.keys(MOOD_RULES), MOODS);
});
test('celebrating wins over stars, unanswered issues, forks and inactivity', () => {
  const all={...quiet,lastReleaseAt:ago(.5),mergedLastDay:2,lastStarDayAt:ago(1),oldestUnansweredIssueAt:ago(15),lastForkAt:ago(2)};
  assert.equal(moodFor(all),'celebrating');
  assert.match(moodWithReason(all).reason,/release/);
  assert.equal(moodFor({...all,lastReleaseAt:null}),'celebrating');
  assert.equal(moodFor({...all,lastReleaseAt:null,mergedLastDay:0}),'grateful');
});
test('grateful uses today/yesterday; anxious then wins over curiosity', () => {
  assert.equal(moodFor({...quiet,lastStarDayAt:ago(1.9),oldestUnansweredIssueAt:ago(15)}),'grateful');
  assert.equal(moodFor({...quiet,lastStarDayAt:ago(2),oldestUnansweredIssueAt:ago(15),lastForkAt:ago(2)}),'anxious');
  assert.equal(moodFor({...quiet,openIssues:100}),'sleeping');
});
test('curious outranks happy for forks and first-time contributor PRs', () => {
  assert.equal(moodFor({...quiet,lastCommitAt:ago(1),lastForkAt:ago(6.9)}),'curious');
  assert.equal(moodFor({...quiet,lastCommitAt:ago(1),lastFirstTimeContributorAt:ago(6.9)}),'curious');
  assert.equal(moodFor({...quiet,lastCommitAt:ago(1),lastForkAt:ago(7)}),'happy');
});
test('happy precedes loneliness; loneliness requires a personal active repo and no outsiders', () => {
  const solo={...quiet,ownerIsUser:true,lastCommitAt:ago(20)};
  assert.equal(moodFor({...solo,lastCommitAt:ago(6.9)}),'happy');
  assert.equal(moodFor({...solo,lastCommitAt:ago(7)}),'lonely');
  assert.equal(moodFor(solo),'lonely');
  assert.equal(moodFor({...solo,ownerIsUser:false}),'happy');
  assert.equal(moodFor({...solo,starsLast60d:1}),'happy');
  assert.equal(moodFor({...solo,outsideLast60d:1}),'happy');
  assert.equal(moodFor({...solo,lastCommitAt:ago(60)}),'sleepy');
});
test('sleep boundaries and the 7–29 day fallback are explicit', () => {
  for(const [days,mood] of [[7,'happy'],[29,'happy'],[30,'sleepy'],[89,'sleepy'],[90,'sleeping'],[179,'sleeping'],[200,'sleeping']]) assert.equal(moodFor({...quiet,lastCommitAt:ago(days)}),mood);
});
test('Markdown uses the live API with layout/theme, never demo overrides', () => {
  const s=markdownFor(DEFAULT_REPO,'square','dark','https://example.com/');
  assert.ok(s.includes('https://example.com/api/pet/amhtutt/shell-pet.svg?layout=square&theme=dark'));
  assert.ok(s.endsWith('(https://github.com/amhtutt/shell-pet)'));
  assert.ok(!/stage=|mood=|lang=|shiny=|gift=/.test(s));
  assert.ok(badgeURL({owner:'a',repo:'.github'},{layout:'wide',theme:'light'}).includes('/a/.github.svg?layout=wide&theme=light'));
});
test('preview URL encodes all selected values, including C++, stars, props and both flags', () => {
  const u=new URL(previewURL(DEFAULT_REPO,{stage:'elder',mood:'grateful',language:'C++',stars:400,contributors:8,releases:2,shiny:true,gift:true},{layout:'wide',theme:'dark'}));
  assert.equal(u.pathname,'/api/preview');
  assert.deepEqual(Object.fromEntries(u.searchParams),{stage:'elder',mood:'grateful',owner:'amhtutt',repo:'shell-pet',lang:'C++',stars:'400',contributors:'8',releases:'2',layout:'wide',theme:'dark',shiny:'1',gift:'1'});
  const off=new URL(previewURL(DEFAULT_REPO,{stars:NaN,contributors:-2,releases:Infinity}));
  assert.equal(off.searchParams.get('stars'),'80'); assert.equal(off.searchParams.get('contributors'),'3'); assert.equal(off.searchParams.get('releases'),'1');
  assert.equal(off.searchParams.has('shiny'),false); assert.equal(off.searchParams.has('gift'),false);
});
test('status headers distinguish missing/private from temporary failure and preserve the reason', () => {
  for(const status of ['ok','missing','unavailable']) {
    const meta=badgeMetadata(new Response('',{headers:{'X-Shell-Pet-Status':status,'X-Shell-Pet-Reason':"There's been a commit this week.",'X-Shell-Pet-Fetched-At':now.toISOString()}}));
    assert.equal(meta.status,status); assert.equal(meta.fetchedAt,now.toISOString());
    if(status==='ok') assert.equal(statusMessage(meta),"There's been a commit this week.");
    if(status==='missing') assert.match(statusMessage(meta),/not found or private/);
    if(status==='unavailable') assert.match(statusMessage(meta),/GitHub is busy/);
  }
  assert.equal(badgeMetadata(new Response('',{headers:{'X-Shell-Pet-Fetched-At':'invalid'}})).fetchedAt,null);
  assert.equal(badgeMetadata(new Response('')).status,'unknown');
});
test('all current stage/mood/shell/theme combinations render self-contained SVG', () => {
  for(const stage of STAGES) for(const mood of MOODS) for(const language of [null,'TypeScript','JavaScript','Python','Rust','Go','Java','C++','Ruby','Swift','Shell']) for(const theme of ['light','dark']) {
    const svg=render(demoPet(DEFAULT_REPO,{stage,mood,language}),{layout:'wide',theme});
    assert.ok(svg.startsWith('<svg')); assert.ok(!/<script|href="https?:|(?:transform|x|y|width|height)="[^"]*(?:NaN|Infinity)/.test(svg), `${stage}/${mood}/${language}/${theme}`); assert.ok(svg.includes('data:image/webp;base64,'));
  }
});
test('UI separates real/demo, exposes five stages, native FAQ, CLI and frozen download', async () => {
  const html=await readFile('public/index.html','utf8'); const app=await readFile('src/app.js','utf8');
  assert.ok(html.includes('id="badge-preview"')); assert.ok(html.includes('id="demo-preview"'));
  assert.ok(!/value="(?:cracking|hatchling|abandoned)"/.test(html));
  assert.ok(html.includes('npx shell-pet init')); assert.ok(html.includes('Save frozen demo SVG'));
  assert.equal((html.match(/<details>/g)||[]).length,7);
  for(const repo of ['amhtutt/shell-pet','chalk/ansi-regex','sindresorhus/tempy','microsoft/vscode-diagnostic-tools','facebook/react','vercel/next.js','torvalds/linux']) assert.ok(app.includes(repo));
});
