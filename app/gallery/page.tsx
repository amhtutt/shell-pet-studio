import Link from "next/link";

// A mix of tiny and huge repos, so you can see what a small project's crab looks like too.
const REPOS = [
  "amhtutt/shell-pet",
  "microsoft/vscode-diagnostic-tools",
  "chalk/ansi-regex",
  "sindresorhus/tempy",
  "facebook/react",
  "vercel/next.js",
  "microsoft/vscode",
  "rust-lang/rust",
  "golang/go",
  "python/cpython",
  "denoland/deno",
  "rails/rails",
  "apple/swift",
  "ohmyzsh/ohmyzsh",
  "torvalds/linux",
];

export const metadata = { title: "Gallery · shell-pet" };

export default function Gallery() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="font-display text-xl font-extrabold">
          shell-pet
        </Link>
        <h1 className="mt-10 font-display text-5xl sm:text-6xl font-extrabold tracking-tight">Gallery</h1>
        <p className="mt-3 text-lg">Live crabs from small and busy repositories alike. Each updates at most once an hour.</p>
        <ul className="mt-10 grid md:grid-cols-2 gap-6">
          {REPOS.map((r) => (
            <li key={r}>
              <a href={`https://github.com/${r}`} className="block rounded-2xl hover:-translate-y-0.5 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/pet/${r}.svg?theme=light&size=lg`}
                  alt={`shell-pet badge for ${r}`}
                  width={640}
                  height={160}
                  loading="lazy"
                  className="w-full h-auto aspect-[4/1] rounded-2xl bg-wet-sand/40"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
