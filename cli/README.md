# shell-pet

Add a [shell-pet](https://shell-pet.vercel.app) hermit crab to your README. Stars feed it, releases grow its shell, and neglect empties it.

[![shell-pet](https://shell-pet.vercel.app/api/pet/amhtutt/shell-pet.svg)](https://github.com/amhtutt/shell-pet)

## Usage

Run it inside a git repository whose `origin` is on GitHub:

```bash
npx shell-pet init
```

It reads `origin`, then adds the badge to `README.md` right after the first `# heading` (or creates the file). Running it again updates the badge in place instead of adding a second one.

| Option | What it does |
| --- | --- |
| `--square` | Crab only, no text |
| `--readme <path>` | Write to a different file |
| `--dry-run` | Print the result instead of writing it |

Set `SHELL_PET_ORIGIN` to point at a self-hosted instance.

## License

MIT
