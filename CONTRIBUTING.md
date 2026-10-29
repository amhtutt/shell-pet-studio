# Contributing to shell-pet

Thanks for helping the crab. This page covers how to set up, what to check before a pull request, and how the art works.

## Set up

Follow [Run it yourself](README.md#run-it-yourself) in the README: clone, `npm install`, put a read-only `GITHUB_TOKEN` in `.env.local`, then `npm run dev`.

## Before you open a pull request

Run the same checks as CI:

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

```bash
npm test
```

```bash
npm run build
```

When you change how the crab looks, open `/dev` in the dev server and check every stage, mood and shell. Check the wide badge in both themes too: `/api/preview?theme=dark`.

## Where things live

| Change | File |
| --- | --- |
| When a mood or stage applies | `lib/mood.ts`, `lib/stage.ts`. Keep the table in the README in sync. |
| What is fetched from GitHub | `lib/github.ts` (and the mocked tests in `tests/github.test.ts`) |
| How the badge is drawn | `svg/render.ts`, `svg/props.ts`, `svg/scene.ts` |
| The CLI | `cli/index.mjs` (its own npm package, no dependencies) |

A few rules the code relies on:

- **Never guess.** If a GitHub lookup fails, throw. The cache keeps the last good crab, and a made-up zero would give the crab the wrong mood.
- **Public only.** Private repos must look exactly like missing ones.
- **Moods are playful, not judgments.** Prefer gentle states (resting, sleepy) over ones that blame maintainers.

## Artwork

The crab is built from PNG layers in `art/`. They were generated with ChatGPT's image tools using the prompts in [`art/PROMPTS.md`](art/PROMPTS.md), then aligned and compressed by `scripts/build-art.py`. The art is included in this repository under the project's [license](LICENSE).

If you contribute new art, only submit images you made yourself or are allowed to share under that license, and keep the existing style: thick dark outline, flat colors, side view facing right, transparent background.

To rebuild the badge images after changing anything in `art/`:

```bash
python3 -m venv .venv
```

```bash
.venv/bin/pip install -r scripts/requirements.txt
```

```bash
.venv/bin/python scripts/build-art.py
```

It takes about 5 minutes and rewrites `svg/art/assets.ts`. Commit that file along with the art.
