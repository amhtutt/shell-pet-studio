import { build } from 'esbuild';
import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await rm(root + 'dist', { recursive: true, force: true });
await mkdir(root + 'dist', { recursive: true });
await cp(root + 'public', root + 'dist', { recursive: true });
await build({ entryPoints: [root + 'src/app.js'], outfile: root + 'dist/app.js', bundle: true, minify: true, format: 'esm', target: ['es2022'], alias: { '@': root + 'src' }, legalComments: 'none' });
const [html, css, config, app] = await Promise.all(['dist/index.html', 'dist/style.css', 'dist/config.js', 'dist/app.js'].map(path => readFile(root + path, 'utf8')));
const standalone = html.replace('<link rel="stylesheet" href="/style.css" />', () => `<style>${css}</style>`)
  .replace('<script src="/config.js"></script>', () => `<script>${config}</script>`)
  .replace('<script type="module" src="/app.js"></script>', () => `<script type="module">${app.replace(/<\/script/gi, '<\\/script')}</script>`)
  .replaceAll('src="/favicon.svg"', 'src="data:image/svg+xml,' + encodeURIComponent(await readFile(root + 'public/favicon.svg', 'utf8')) + '"');
await writeFile(root + 'preview.html', standalone);
console.log('Built static site → dist/');
