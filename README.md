# shell-pet

A tiny hermit crab for every repository.

<!-- shell-pet -->
[![shell-pet](https://shell-pet.vercel.app/api/pet/lma0/shell-pet.svg)](https://github.com/lma0/shell-pet)
<!-- /shell-pet -->

Stars feed it, releases grow its shell, contributors decorate it, and neglect empties it. Every repo hatches its own crab, seeded from `owner/repo`.

## Quick start

```bash
npx shell-pet init
```

Or paste this into your README:

```md
[![shell-pet](https://shell-pet.vercel.app/api/pet/OWNER/REPO.svg)](https://github.com/OWNER/REPO)
```

| Param    | Values                  | Default |
| -------- | ----------------------- | ------- |
| `layout` | `wide` · `square`       | `wide`  |
| `theme`  | `auto` · `light` · `dark` | `auto`  |
| `size`   | `sm` · `md` · `lg`      | `md`    |

## How it lives

- **Stages (stars):** egg 0 · cracking 1–4 · hatchling 5–24 · juvenile 25–199 · adult 200–999 · elder 1000+. Archived or 180 days without a commit → abandoned shell.
- **Moods (first match wins):** celebrating (release/merged PR in 24h) · grateful (star in 24h) · anxious (30+ open issues or an issue unanswered 14+ days) · curious (new fork / first-time contributor in 7d) · happy (commit in 7d) · lonely (only the owner, 60d) · sleepy (30–89d quiet) · sleeping (90–179d).
- **Shell:** TypeScript, JavaScript, Python, Rust, Go, Java, C/C++, Ruby, Swift and Shell get hand-drawn shells; everything else gets a seeded generic shell tinted with its linguist color. Shell size follows log(stars) and major releases; one decoration per contributor (max 8).
- **Shiny:** 1 in 512 repos.

## Development

```bash
cp .env.example .env.local   # add a GITHUB_TOKEN
npm install
npm run dev                  # http://localhost:3000
npm test                     # logic + SVG snapshot tests
```

- `/api/preview?stage=&mood=&lang=&seed=&shiny=1&gift=1&layout=&theme=` renders any combination without GitHub.
- `/dev` is a contact sheet of every stage, mood and shell.
- Renderer is pure: `render(state, options) → string` in [`svg/render.ts`](svg/render.ts).
- SVGs are self-contained (no external assets, no JS), use CSS keyframes, honor `prefers-color-scheme` and `prefers-reduced-motion`, and stay under 25 KB.

The CLI lives in [`cli/`](cli) as its own npm package.

## License

MIT
