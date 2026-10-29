# shell-pet studio

A responsive shell-pet frontend using the shared code and artwork pinned to **amhtutt/shell-pet `0c83b914331c5c919da530e8a380a5860f734b50`**.

Live site: https://shell-pet-studio.vercel.app

## Run and verify

Node.js 22 or newer:

```bash
npm ci
npm test
npm run dev
```

Open http://localhost:3000. The development server builds at startup; restart after source edits.

```bash
npm run build
```

Production files are written to `dist/`. `preview.html` is regenerated as a single-file preview you can open in a browser. Live badges, demos and optional Google Fonts require an internet connection. Clipboard access may need HTTPS or localhost; the UI falls back to selecting the text for manual copying.

## Live badge versus demo

- **Your real README badge** loads `/api/pet/OWNER/REPO.svg` from https://shell-pet.vercel.app. Repository input accepts the upstream `parseRepoInput` formats, including dot-prefixed names such as `.github`.
- The reason, status and data timestamp come from `X-Shell-Pet-Status`, `X-Shell-Pet-Reason` and `X-Shell-Pet-Fetched-At`. Requests abort when superseded and time out after 15 seconds. Missing/private repositories and temporary upstream failures have distinct messages.
- The upstream API now serves `Access-Control-Allow-Origin: *` and exposes those three headers. Studio reads them directly. No proxy, GitHub token, local stats simulation or server API is included. If CORS or header access becomes unavailable, Studio labels activity details unavailable instead of inventing a mood or claiming the repository is missing.
- **Explore a demo** uses the real `/api/preview` endpoint. Its stage, mood, shell, stars, contributors, releases, shiny and recent-star gift controls never change the live badge or copied Markdown.
- **Copy Markdown** always uses the live badge URL, with the selected layout and theme. The CLI alternative is `npx shell-pet init`.
- **Save frozen demo SVG** downloads the current preview response. It never claims to be a live badge. Its selected state is frozen, though embedded CSS animation still plays.
- The hero alone uses the local shared renderer, with a coral illustration color. Lifecycle examples, mood examples and language shells use `/api/preview`. The seven repository gallery entries use the real live badge endpoint.

## Current behavior

| Stage | Condition |
| --- | --- |
| Egg | 0 stars |
| Juvenile | 1–19 stars, already wearing a shell |
| Adult | 20–299 stars |
| Elder | 300+ stars |
| Resting | Archived or 180+ days without commits; the crab naps with a nightcap. Eggs stay eggs. |

Mood rules use the shared priority: Celebrating, Grateful, Anxious, Curious, Happy, Lonely, Sleepy, Sleeping. The website lists the actual conditions and shows the API’s reason for real badges. Other activity falls back to Happy. Personal repositories alone can be Lonely; issue volume by itself does not make a crab Anxious.

Juveniles get up to three decorations, adults and elders up to eight. Stars grow shells smoothly inside each stage and major releases add size. Losing stars can move a crab back a stage. Badges refresh about hourly when viewed; there is no background job. Private and missing repositories look identical.

## Deploy

The repository is linked to the separate `shell-pet-studio` Vercel project. Pushes to `main` deploy automatically. The existing `shell-pet` project is separate.

For another deployment, import this repository into Vercel using **Other**, build command `npm run build`, output directory `dist`. `vercel.json` declares these settings. No environment variables are required.

`public/config.js` sets the public badge API origin and GitHub navigation link. If replacing the API, configure CORS on that origin for Studio and expose the three status headers. The preview endpoint must also allow cross-origin GET for snapshot downloads.

## Source map

| File | Purpose |
| --- | --- |
| `public/index.html` | Structure, copy, controls, FAQ |
| `public/style.css` | Responsive seaside design |
| `public/config.js` | Public API and repository URLs |
| `src/app.js` | Live metadata, demos, galleries, clipboard and download |
| `src/demo.js` | URL construction, captions and response metadata helpers |
| `src/lib/`, `src/svg/` | Exact pinned shared code and new sticker-sheet artwork |
| `shared-source.json` | Upstream commit and Git blob hashes for all 14 shared files |
| `tests/demo.test.mjs` | Integrity, thresholds, mood priority, input, URL, metadata and renderer tests |

The copied `lib/pet.ts` retains its upstream type-only reference to `RepoSnapshot`. The server implementation is intentionally absent; esbuild removes the type-only import. `lib/github.ts`, `lib/snapshot.ts` and `lib/options.ts` are not copied.

Artwork is SVG markup containing embedded WebP layers, not path-only vector art.

## License

MIT © Aung Htut. Shared artwork and renderer: https://github.com/amhtutt/shell-pet at the pinned commit above. See `LICENSE`, `NOTICE.md` and `shared-source.json`.
