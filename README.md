# shell-pet studio

A responsive frontend redesign of shell-pet, based on the approved “Your code. Their home.” mockup. Includes the existing shell-pet crab art, interactive previews, language shells, mood and growth demos, light/dark previews, SVG download, and Markdown copying.

## See it immediately

Open `preview.html` in a browser. It is a self-contained copy of the website. Fonts load from Google Fonts when online, with system-font fallbacks. The interactive artwork is embedded, so no image server is needed. Your browser may require the local dev server for clipboard access; when copying is blocked, the snippet is selected for manual copying.

## Run locally

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. The simple development server builds at startup. Restart it after making source changes.

```bash
npm test
npm run build
```

The production site is written to `dist/`. `preview.html` is regenerated at the same time.

## Deploy a separate copy to Vercel

1. Unzip this project.
2. Create a new GitHub repository, for example `shell-pet-studio`.
3. Upload the **contents** of this folder to the repository root, or push with Git. Do not upload `node_modules`.
4. In Vercel, choose **Add New → Project**, then import that repository.
5. Use **Other** as the framework preset, `npm run build` as the build command, and `dist` as the output directory. `vercel.json` already declares these settings.
6. Deploy. No environment variables, database, tokens, or backend are required.

The new repo is independent of `amhtutt/shell-pet`; it does not replace the current website.

## What is live and what is a demo?

- The website renders locally in the browser. Entering a repository deterministically changes its appearance; it does **not** fetch GitHub statistics or verify repository existence.
- Stage, mood, shell, and shiny controls are illustrative. They are explicitly labeled as an interactive demo and do not change real repository activity.
- The copied Markdown uses the **existing** live API at `https://shell-pet.vercel.app/api/pet/OWNER/REPO.svg`. Real installed pets follow that API’s rules, not the selected demo stage/mood/shell/shiny settings.
- Layout and light/dark theme are included in the copied Markdown.
- **Save SVG** downloads the current demo image. It is a static snapshot of the selected state, with embedded CSS animation; it does not update from GitHub.
- Set `badgeOrigin` in `public/config.js` if you later connect your own badge service. Change `projectUrl` there to point navigation links at your new GitHub repository.

## Edit the design

| File | Purpose |
| --- | --- |
| `public/index.html` | Page structure, copy, navigation, controls |
| `public/style.css` | Colors, typography, layouts, responsive styles |
| `public/config.js` | Live badge service and project link |
| `src/app.js` | UI interactions, galleries, clipboard and download |
| `src/demo.js` | Repository parsing, demo state, Markdown URLs |
| `src/svg/` | Existing layered artwork renderer |
| `src/lib/` | Deterministic traits, stage, language, and mood helpers |
| `design-reference.png` | Approved visual reference |

The badges are SVG documents containing embedded WebP art layers. They are not path-only vector drawings.

## Design choices

- Cream, coral, sand, and pale blue, with rounded editorial headings.
- Original shell-pet artwork instead of independently redrawn characters.
- An early preview/copy workspace, with clickable lifecycle and shell examples.
- Mobile layouts, visible keyboard focus, semantic labels, clipboard fallback, and reduced-motion support.
- Extra top clearance for large shells and jumping moods.
- No analytics, accounts, live GitHub requests, or server implementation.

## Credits and license

MIT © Aung Htut. Crab artwork and rendering helpers originate from [amhtutt/shell-pet](https://github.com/amhtutt/shell-pet), commit `9da85ee786e2e2f4f0e50c93bcdb30a5fe21a80c`. The redesign adds a static browser UI and adjusts preview framing and resting-state copy. See `LICENSE` and `NOTICE.md`.
