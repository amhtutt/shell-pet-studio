<div align="center">

# 🦀 shell-pet-studio

**A tiny hermit crab that lives in your README.**<br>
Stars feed it, releases grow its shell, contributors decorate it, and quiet projects give it a nap.

<!-- shell-pet -->
[![shell-pet](https://shell-pet.vercel.app/api/pet/amhtutt/shell-pet-studio.svg?size=lg)](https://github.com/amhtutt/shell-pet-studio)
<!-- /shell-pet -->

[**Find your crab**](https://shell-pet.vercel.app) · [Gallery](https://shell-pet.vercel.app/gallery) · [Report a bug](https://github.com/amhtutt/shell-pet-studio/issues)

</div>

---

## Unified Studio application

This repository now contains the complete Next.js application, merged from shell-pet commit `40965ad052356218ecb1edc4db679ca3c2598780`, including its Git history. Studio remains the homepage; the badge API, snapshot cache, CLI, source PNGs, sticker sheets, reference images, art build script and upstream tests are all here.

- Studio’s real badges, demo previews, status reasons and fetched times use same-origin `/api/...` requests.
- Copied Markdown intentionally keeps `https://shell-pet.vercel.app/api/pet/OWNER/REPO.svg` as the public badge address.
- The default repository and real gallery now use `amhtutt/shell-pet-studio`.
- Root `lib/` and `svg/` are canonical. Duplicate `src/lib/` and `src/svg/` copies and their copy-hash manifest have been removed.
- The previous shell-pet homepage, layout and CSS remain in `reference/legacy-*` as source references. `/gallery`, `/dev` and `/dev/view` are retained.
- `npm test` runs both the original Vitest suite and Studio’s tests. `npm run build` builds Next.js; there is no `dist` export.

### Production cutover

Set `GITHUB_TOKEN` on the **shell-pet-studio** Vercel project (server-only, public repositories read access). Without it, the live API correctly returns an unavailable badge, while demo previews still work. Set Vercel’s Framework Preset to Next.js and remove any project-level output-directory override for `dist`.

The hostname `shell-pet.vercel.app` must keep serving this merged application before the old Vercel project is removed. Moving Git source does not transfer environment variables, domain assignments, GitHub repository settings/issues/stars, or the published npm package’s metadata. The old repository and Vercel project have not been deleted by this merge.

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
10. [Contributing](#contributing)
11. [License](#license)

---

## What it is

Every public GitHub repository already has a crab. You just haven't met it yet.

- **It's yours.** The crab's color, shell shape and decorations come from your repo's name, so the same repo always gets the same crab. (With 8 colors and a few shells, two repos can end up looking alike.)
- **It reacts.** Whenever the badge is viewed, it uses your repo's activity from the last hour or so. It celebrates releases, worries about issues waiting for a reply, and naps when nobody commits.
- **It grows.** It starts as an egg and gets its shell with the first star. More stars mean a bigger crab.
- **It's playful, not a health score.** A quiet or finished project isn't a bad one, so the crab just rests.
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

**Step 4.** Open your repo on GitHub. Your crab is there. ⭐ Star the repo to hatch it.

> **Tip:** the [website](https://shell-pet.vercel.app) builds the line for you. Type your repo, check the preview, click **Copy snippet**.

### Option B: let the CLI do it

Run this inside your project folder:

```bash
npx shell-pet init
```

It reads your `origin` remote (it must be on github.com), adds the badge under your README's first `#` heading, and tells you what it did. It leaves YAML front matter and code examples alone. Running it again updates the badge instead of adding a second one.

| Flag | What it does |
| --- | --- |
| `--square` | Use the crab-only badge |
| `--readme <path>` | Write to a different file |
| `--dry-run` | Print the result without saving |

Unknown flags are rejected rather than ignored, so a typo never edits your README by surprise.

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
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=juvenile&seed=7&lang=" width="72"> | **Juvenile** | 1–19 | A small crab in its first shell |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=adult&seed=7&lang=" width="72"> | **Adult** | 20–299 | Full size, shell decorated by contributors |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=elder&seed=7&lang=&contributors=8" width="72"> | **Elder** | 300+ | A bigger shell, fully decorated, with sparkles |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&stage=resting&seed=7&lang=" width="72"> | **Resting** | any | Archived, or no commits for 180 days. The crab naps in its shell. |

**Other things that change it**

- **Contributors** add decorations to the shell (barnacles, stickers, flowers, hearts, pebbles): one each, up to 3 on a juvenile and up to 8 from adult on.
- **Major releases** make the shell a little bigger, as do more stars within a stage. A major release is a release tag like `v2`, `v2.1` or `3.0.0`; only the latest 100 releases are checked.
- **New stars** leave a small gift on the sand for about 3 days.
- **Stages follow the current star count**, so if a repo loses stars, its crab can move back a stage.
- **1 in 512** repos hatches a rare ✦ **shiny** crab, deep navy with a gold band.

---

## Moods

The **first** matching mood wins. The [website](https://shell-pet.vercel.app) shows the reason for any repo, for example *"An open issue has had no reply for 16 days."*

| | Mood | When |
| :---: | --- | --- |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=celebrating&seed=7&lang=" width="72"> | **Celebrating** | A release, or a merged pull request, in the last day |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=grateful&seed=7&lang=" width="72"> | **Grateful** | New stars today or yesterday |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=anxious&seed=7&lang=" width="72"> | **Anxious** | An open issue has had no reply (no comments at all) for 14+ days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=curious&seed=7&lang=" width="72"> | **Curious** | A new fork, or a first-time contributor's pull request, in the last 7 days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=happy&seed=7&lang=" width="72"> | **Happy** | A commit in the last 7 days. Also the mood when nothing else matches. |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=lonely&seed=7&lang=" width="72"> | **Lonely** | A personal repo the owner committed to in the last 60 days, but nobody else starred it, opened an issue or sent a pull request. A commit this week makes it happy instead. |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=sleepy&seed=7&lang=" width="72"> | **Sleepy** | No commits for 30–89 days |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&mood=sleeping&seed=7&lang=" width="72"> | **Sleeping** | No commits for 90+ days. It's tucked into its shell with a nightcap. |

"Today" and "yesterday" come from GitHub's daily star history, whose days don't line up exactly with UTC midnight.

---

## Shells

Your repo's main language picks the shell. These languages get their own:

| | | | | |
| :---: | :---: | :---: | :---: | :---: |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=TypeScript&seed=7&contributors=0" width="80"><br>TypeScript | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=JavaScript&seed=7&contributors=0" width="80"><br>JavaScript | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Python&seed=7&contributors=0" width="80"><br>Python | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Rust&seed=7&contributors=0" width="80"><br>Rust | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Go&seed=7&contributors=0" width="80"><br>Go |
| <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Java&seed=7&contributors=0" width="80"><br>Java | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=C&seed=7&contributors=0" width="80"><br>C / C++ | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Ruby&seed=7&contributors=0" width="80"><br>Ruby | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Swift&seed=7&contributors=0" width="80"><br>Swift | <img src="https://shell-pet.vercel.app/api/preview?layout=square&lang=Shell&seed=7&contributors=0" width="80"><br>Shell |

Every other language gets one of four classic shells (spiral, round, spiky conch or tall cone), chosen by your repo's name. Its stripe uses the language's GitHub color for about 60 common languages, and the crab's own accent color otherwise.

---

## FAQ

<details>
<summary><b>How often does my crab update?</b></summary>

There's no background job. When someone views the badge and the saved copy is more than an hour old, shell-pet asks GitHub again. Moods that depend on time, like sleepy, are worked out at view time. GitHub also caches README images, so a change can take a little longer to show up.

If GitHub is down or rate-limited, the badge keeps showing the last crab it saw. If it has never seen your repo, it shows a resting egg that says GitHub is busy, instead of guessing.
</details>

<details>
<summary><b>Does it work with private repositories?</b></summary>

No. shell-pet only reads public data, and it checks: a private repo is treated exactly like a missing one and shows a "lost egg", so nothing about it leaks into the badge.
</details>

<details>
<summary><b>Does it track my visitors?</b></summary>

No. The badge is a plain image with no scripts and no cookies, and shell-pet keeps no visitor logs.

- **On GitHub,** README images are fetched by GitHub's image proxy, so shell-pet never sees your visitors at all.
- **Elsewhere,** if you embed the badge on another site, or someone opens the website, their browser talks to shell-pet directly, like any image host. The hosting provider (Vercel) sees standard request information such as IP addresses.
</details>

<details>
<summary><b>Can I choose my crab's color?</b></summary>

No, and that's the point. Your repo's name decides it, so your crab always looks the same. You can change the layout, theme and size.
</details>

<details>
<summary><b>My crab is anxious. How do I cheer it up?</b></summary>

Reply to any open issue that's been waiting two weeks or more without a comment. Once every older open issue has a reply, the worry goes away.
</details>

---

## Run it yourself

You only need this to change shell-pet itself or host your own copy. To use the badge, see [Add it to your README](#add-it-to-your-readme).

### What you need

- [Node.js](https://nodejs.org) 18 or newer
- A [GitHub personal access token](https://github.com/settings/personal-access-tokens/new) (required)
  - Choose **Public repositories (read-only)**.
  - It needs no other permissions. Don't give it access to private repos.
  - Each crab refresh uses 3 GitHub requests, so a token covers about 1,600 refreshes an hour.

### Step 1. Get the code

```bash
git clone https://github.com/amhtutt/shell-pet-studio.git
```

```bash
cd shell-pet-studio
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
| `/api/pet/OWNER/REPO.svg` | The real badge, using live GitHub data. Response headers `X-Shell-Pet-Status`, `X-Shell-Pet-Reason` and `X-Shell-Pet-Fetched-At` say what happened and why. CORS is open, so other sites can read them with `fetch`. |
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
.venv/bin/pip install -r scripts/requirements.txt
```

```bash
.venv/bin/python scripts/build-art.py
```

This lines up every layer, makes the body color variants, and writes compressed WebP images to `svg/art/assets.ts`.

---

## How it works

```
GitHub API ──► lib/github.ts ──► lib/snapshot.ts ──► lib/pet.ts ──► svg/render.ts ──► SVG badge
               3 requests       cached per repo     stage, mood     stacks art layers
                                for an hour         and reason
```

1. **Fetch.** [`lib/github.ts`](lib/github.ts) makes one GraphQL query plus two small requests: contributors, and GitHub's daily star history. The query uses exact search counts, for example "PRs merged in the last day" and "the oldest issue with no comments". Every lookup must succeed; a failed refresh is never turned into made-up zeros.
2. **Cache.** [`lib/snapshot.ts`](lib/snapshot.ts) keeps one snapshot per repo for an hour. Every layout, theme and size shares it, and the last good snapshot is kept if a refresh fails.
3. **Decide.** [`lib/stage.ts`](lib/stage.ts) picks the life stage and [`lib/mood.ts`](lib/mood.ts) picks the mood and the reason for it. [`lib/traits.ts`](lib/traits.ts) turns a hash of `owner/repo` into the crab's color, shell and decorations.
4. **Draw.** [`svg/render.ts`](svg/render.ts) stacks the layers (gap fill, crab, shell, tinted band, decorations, props) and adds the beach scene, the text and CSS animations. These include bobbing, blinking, jumping, confetti, floating z's and twinkling sparkles. All of them turn off for people who prefer reduced motion.

```
app/            Studio homepage, gallery, dev pages and API routes
lib/            canonical GitHub data, snapshots, stage, mood, traits, seeding
svg/            the badge renderer; svg/art/assets.ts is generated
art/            source art layers and the prompts that made them
scripts/        build-art.py: art/ → svg/art/assets.ts
cli/            the `npx shell-pet` package
tests/          logic, CLI and rendering tests
```

---

## Contributing

Ideas and fixes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to run the checks, and [CHANGELOG.md](CHANGELOG.md) for what changed.

---

## License

[MIT](LICENSE) © Aung Htut. The artwork in [`art/`](art) was generated with ChatGPT's image tools; see [CONTRIBUTING.md](CONTRIBUTING.md#artwork).

<div align="center"><sub>Made with 🦀 and a lot of stars.</sub></div>
