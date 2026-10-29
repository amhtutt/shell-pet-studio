<div align="center">

# 🦀 shell-pet

**A tiny hermit crab that lives in your README.**<br>
Stars feed it, releases grow its shell, contributors decorate it, and neglect empties it.

<!-- shell-pet -->
[![shell-pet](https://shell-pet.vercel.app/api/pet/amhtutt/shell-pet.svg?size=lg)](https://github.com/amhtutt/shell-pet)
<!-- /shell-pet -->

[**Find your crab**](https://shell-pet.vercel.app) · [Gallery](https://shell-pet.vercel.app/gallery) · [Report a bug](https://github.com/amhtutt/shell-pet/issues)

</div>

---

## Contents

1. [What it is](#what-it-is)
2. [Add it to your README](#add-it-to-your-readme)
3. [Customize the badge](#customize-the-badge)
4. [How your crab grows](#how-your-crab-grows)
5. [Moods](#moods)
6. [Shells](#shells)
7. [FAQ](#faq)
8. [Run it yourself](#run-it-yourself)
9. [How it works](#how-it-works)
10. [License](#license)

---

## What it is

Every public GitHub repository already has a crab. You just haven't met it yet.

- **It's yours.** The crab's color, shell shape and decorations come from your repo's name, so the same repo always gets the same crab.
- **It's alive.** It reads your repo's activity every hour and reacts: it celebrates releases, gets anxious about unanswered issues, and falls asleep when nobody commits.
- **It grows.** It starts as an egg and grows up as your repo collects stars.
- **It's just an image.** One line of Markdown, no setup, no tracking, no JavaScript.

---

## Add it to your README

Pick **one** of the two ways below.

### Option A: paste one line (works everywhere)

**Step 1.** Copy this line:

```md
[![shell-pet](https://shell-pet.vercel.app/api/pet/OWNER/REPO.svg)](https://github.com/OWNER/REPO)
```

**Step 2.** Replace `OWNER/REPO` (in both places) with your repository, for example `vercel/next.js`.

**Step 3.** Paste it into your `README.md`, near the top, then commit and push.

**Step 4.** Open your repo on GitHub. Your crab is there. ⭐ Star the repo to feed it.

> **Tip:** the [website](https://shell-pet.vercel.app) builds the line for you. Type your repo, check the preview, click **Copy snippet**.

### Option B: let the CLI do it

Run this inside your project folder:

```bash
npx shell-pet init
```

It reads your `origin` remote, adds the badge under your README's first heading, and tells you what it did. Running it again updates the badge instead of adding a second one.

| Flag | What it does |
| --- | --- |
| `--square` | Use the crab-only badge |
| `--readme <path>` | Write to a different file |
| `--dry-run` | Print the result without saving |

---

## Customize the badge

Add options to the end of the image URL, for example `…/REPO.svg?layout=square&theme=dark`.

| Option | Values | Default | What it changes |
| --- | --- | --- | --- |
| `layout` | `wide`, `square` | `wide` | `wide` has the repo name and status; `square` is just the crab |
| `theme` | `auto`, `light`, `dark` | `auto` | `auto` follows the viewer's light or dark mode |
| `size` | `sm`, `md`, `lg` | `md` | Wide: 360, 480 or 640px. Square: 96, 160 or 240px |

<table>
<tr>
<td align="center"><img src="https://shell-pet.vercel.app/api/preview?theme=light&seed=7&lang=TypeScript&owner=you&repo=wide-light" width="360" alt="wide, light"><br><code>layout=wide&theme=light</code></td>
<td align="center"><img src="https://shell-pet.vercel.app/api/preview?theme=dark&seed=7&lang=TypeScript&owner=you&repo=wide-dark" width="360" alt="wide, dark"><br><code>layout=wide&theme=dark</code></td>
<td align="center"><img src="https://shell-pet.vercel.app/api/preview?layout=square&seed=7&lang=TypeScript" width="120" alt="square"><br><code>layout=square</code></td>
</tr>
</table>

---

## How your crab grows

The life stage depends on your repo's stars.

| | Stage | Stars | What you see |
| :---: | --- | --- | --- |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=egg" width="72"> | **Egg** | 0 | A speckled egg on the sand |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=cracking&seed=7" width="72"> | **Cracking** | 1–4 | Something is peeking out |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=hatchling&seed=7" width="72"> | **Hatchling** | 5–24 | A tiny crab with no shell yet, holding a pebble |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=juvenile&seed=7&lang=" width="72"> | **Juvenile** | 25–199 | A small crab in its first shell |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=adult&seed=7&lang=" width="72"> | **Adult** | 200–999 | Full size, shell decorated by contributors |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=elder&seed=7&lang=&contributors=8" width="72"> | **Elder** | 1,000+ | A bigger shell, fully decorated, with sparkles |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=abandoned&seed=7&lang=" width="72"> | **Abandoned** | any | No commits for 180 days, or the repo is archived. The crab moved out. |

**Other things that change it**

- **Contributors** add decorations to the shell: barnacles, stickers, flowers, hearts, pebbles. One each, up to 8.
- **Major releases** (v1, v2, v3…) make the shell a little bigger, as do more stars within a stage.
- **New stars** leave a small gift on the sand for 3 days.
- **1 in 512** repos hatches a rare ✦ **shiny** crab, deep navy with a gold band.

---

## Moods

The crab checks your repo every hour. The **first** matching mood wins.

| | Mood | When |
| :---: | --- | --- |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=celebrating&seed=7&lang=" width="72"> | **Celebrating** | A release or merged pull request in the last 24 hours |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=grateful&seed=7&lang=" width="72"> | **Grateful** | Someone starred the repo in the last 24 hours |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=anxious&seed=7&lang=" width="72"> | **Anxious** | 30+ open issues, or an issue with no reply for 14+ days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=curious&seed=7&lang=" width="72"> | **Curious** | A new fork or a first-time contributor in the last 7 days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=happy&seed=7&lang=" width="72"> | **Happy** | A commit in the last 7 days (the usual mood) |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=lonely&seed=7&lang=" width="72"> | **Lonely** | The owner is committing, but nobody else has starred, opened an issue or sent a PR in 60 days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=sleepy&seed=7&lang=" width="72"> | **Sleepy** | No commits for 30–89 days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=sleeping&seed=7&lang=" width="72"> | **Sleeping** | No commits for 90–179 days. It's tucked into its shell with a nightcap. |

---

## Shells

Your repo's main language picks the shell. These languages get their own:

| | | | | |
| :---: | :---: | :---: | :---: | :---: |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=TypeScript&seed=7&contributors=0" width="80"><br>TypeScript | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=JavaScript&seed=7&contributors=0" width="80"><br>JavaScript | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Python&seed=7&contributors=0" width="80"><br>Python | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Rust&seed=7&contributors=0" width="80"><br>Rust | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Go&seed=7&contributors=0" width="80"><br>Go |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Java&seed=7&contributors=0" width="80"><br>Java | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=C&seed=7&contributors=0" width="80"><br>C / C++ | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Ruby&seed=7&contributors=0" width="80"><br>Ruby | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Swift&seed=7&contributors=0" width="80"><br>Swift | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Shell&seed=7&contributors=0" width="80"><br>Shell |

Every other language gets one of four classic shells (spiral, round, spiky conch or tall cone), chosen by your repo's name, with a stripe in that language's GitHub color.

---

## FAQ

<details>
<summary><b>How often does my crab update?</b></summary>

About once an hour. GitHub also caches README images, so a change can take a little longer to show up.
</details>

<details>
<summary><b>Does it work with private repositories?</b></summary>

No. shell-pet only reads public data through GitHub's API. A private or missing repo shows a "lost egg" instead of an error.
</details>

<details>
<summary><b>Does it track my visitors?</b></summary>

No. The badge is a plain image with no scripts, and the server never sees who is viewing your README. GitHub fetches the image through its own proxy.
</details>

<details>
<summary><b>Can I choose my crab's color?</b></summary>

No, and that's the point. Your repo's name decides it, so every crab is one of a kind. You can change the layout, theme and size.
</details>

<details>
<summary><b>My crab is anxious. How do I cheer it up?</b></summary>

Reply to issues that have been waiting for two weeks or more, or close a few old ones until fewer than 30 are open.
</details>

---

## Run it yourself

You only need this to change shell-pet itself or host your own copy. To use the badge, see [Add it to your README](#add-it-to-your-readme).

### What you need

- [Node.js](https://nodejs.org) 18 or newer
- A [GitHub personal access token](https://github.com/settings/personal-access-tokens/new)
  - Choose **Public repositories (read-only)**.
  - It needs no other permissions.
  - Without one, GitHub allows only about 5 repos an hour.

### Step 1. Get the code

```bash
git clone https://github.com/amhtutt/shell-pet.git
```

```bash
cd shell-pet
```

### Step 2. Install

```bash
npm install
```

### Step 3. Add your token

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your token after `GITHUB_TOKEN=`.

### Step 4. Start it

```bash
npm run dev
```

Open <http://localhost:3000>. Useful pages while developing:

| Page | What it shows |
| --- | --- |
| `/api/pet/OWNER/REPO.svg` | The real badge, using live GitHub data |
| `/api/preview?stage=adult&mood=happy&lang=Rust` | Any combination, no GitHub needed. Also takes `seed`, `shiny=1`, `gift=1`, `contributors`, `layout`, `theme` |
| `/dev` | Every stage, mood and shell on one page |

### Step 5. Run the tests

```bash
npm test
```

### Deploy to Vercel

1. Push your copy to GitHub.
2. In Vercel, click **Add New → Project** and import the repo. Next.js is detected automatically.
3. Under **Settings → Environment Variables**, add `GITHUB_TOKEN`. Mark it **Sensitive**.
4. If you use your own domain, also add `NEXT_PUBLIC_SITE_URL`, for example `https://crabs.example.com`.
5. Deploy. Every push to `main` redeploys.

### Changing the art

The crab is drawn from the PNG layers in [`art/`](art): one crab per mood, blink frames, shells, bands and sticker sheets. [`art/PROMPTS.md`](art/PROMPTS.md) has the prompts used to make them. After changing any of them, rebuild the badge assets:

```bash
python3 -m venv .venv
```

```bash
.venv/bin/pip install pillow numpy scipy
```

```bash
.venv/bin/python scripts/build-art.py
```

This lines up every layer, makes the body color variants, and writes compressed WebP images to `svg/art/assets.ts`.

---

## How it works

```
GitHub API ──► lib/github.ts ──► lib/pet.ts ──► svg/render.ts ──► SVG badge
 (hourly cache)   repo stats      stage + mood     stacks art layers
```

1. **Fetch.** [`lib/github.ts`](lib/github.ts) reads stars, releases, commits, issues, pull requests, forks and contributors. Results are cached for an hour. If a lookup fails, it falls back to safe defaults, so the badge always renders.
2. **Decide.** [`lib/stage.ts`](lib/stage.ts) picks the life stage and [`lib/mood.ts`](lib/mood.ts) picks the mood. [`lib/traits.ts`](lib/traits.ts) turns a hash of `owner/repo` into the crab's color, shell and decorations.
3. **Draw.** [`svg/render.ts`](svg/render.ts) stacks the layers (gap fill, crab, shell, tinted band, decorations, props) and adds the beach scene, the text and CSS animations. These include bobbing, blinking, jumping, confetti, floating z's and twinkling sparkles. All of them turn off for people who prefer reduced motion.

```
app/            website, gallery and API routes
lib/            GitHub data, stage, mood, traits, seeding
svg/            the badge renderer; svg/art/assets.ts is generated
art/            source art layers and the prompts that made them
scripts/        build-art.py: art/ → svg/art/assets.ts
cli/            the `npx shell-pet` package
tests/          logic, CLI and rendering tests
```

---

## License

[MIT](LICENSE) © Aung Htut

<div align="center"><sub>Made with 🦀 and a lot of stars.</sub></div>
