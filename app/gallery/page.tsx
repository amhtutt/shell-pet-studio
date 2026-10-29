import Link from "next/link";

// Small projects and busy neighborhoods deserve a place on the same shore.
const REPOS = [
  "amhtutt/shell-pet-studio", "microsoft/vscode-diagnostic-tools",
  "chalk/ansi-regex", "sindresorhus/tempy", "facebook/react", "vercel/next.js",
  "microsoft/vscode", "rust-lang/rust", "golang/go", "python/cpython",
  "denoland/deno", "rails/rails", "apple/swift", "ohmyzsh/ohmyzsh", "torvalds/linux",
];

export const metadata = {
  title: "The neighborhood · shell-pet",
  description: "Meet the hermit crabs living in real GitHub repositories, from tiny projects to busy communities.",
};

export default function Gallery() {
  return (
    <>
      <a className="skip" href="#residents">Skip to the residents</a>
      <header className="header wrap">
        <Link className="brand" href="/" aria-label="shell-pet home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" width={41} height={41} />
          shell-pet<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#lifecycle">The lifecycle</Link>
          <Link href="/#collection">Shell collection</Link>
          <Link href="/gallery" aria-current="page">Gallery</Link>
          <a className="github-link" href="https://github.com/amhtutt/shell-pet-studio">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
      </header>
      <main className="wrap gallery-page">
        <section className="gallery-intro" aria-labelledby="gallery-heading">
          <div>
            <p className="eyebrow">NEIGHBORS ON THE SHORE</p>
            <h1 id="gallery-heading">Every repo.<br /><span className="coral">A little resident.</span></h1>
            <p className="gallery-lead">Small projects. Busy communities.<br />A tiny home for every kind of code.</p>
            <Link className="text-link" href="/#adopt">Find your repository’s crab <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="gallery-welcome">
            <span className="gallery-hello">Room for one more.</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/preview?owner=amhtutt&repo=shell-pet-studio&stage=adult&mood=curious&lang=TypeScript&contributors=3&layout=square&theme=light&size=lg" alt="A curious hermit crab welcoming you to the neighborhood" width={300} height={300} fetchPriority="high" />
          </div>
        </section>
        <section id="residents" aria-labelledby="residents-heading">
          <div className="gallery-section-heading">
            <div><p className="eyebrow">REAL REPOS. REAL RESIDENTS.</p><h2 id="residents-heading">Meet the neighborhood.</h2></div>
            <span className="gallery-live"><span className="status-dot" aria-hidden="true" />{REPOS.length} live repository badges</span>
          </div>
          <ul className="repo-gallery gallery-residents">
            {REPOS.map((repo) => (
              <li className="gallery-card" key={repo}>
                <a href={`https://github.com/${repo}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/pet/${repo}.svg?layout=wide&theme=light&size=lg`} alt={`Live shell-pet badge for ${repo}`} width={640} height={160} loading="lazy" />
                  <span className="gallery-repo-name">{repo}<b aria-hidden="true">↗</b></span>
                </a>
              </li>
            ))}
          </ul>
          <p className="gallery-note">These badges reflect real repository activity. They refresh about hourly when viewed; their stage and mood can change. Missing or private repos show a lost egg, and temporary GitHub trouble shows a resting egg.</p>
        </section>
        <section className="closing gallery-invitation" aria-labelledby="invitation-heading">
          <p className="eyebrow">THERE’S A PLACE FOR YOUR PROJECT, TOO</p>
          <h2 id="invitation-heading">Make room for a little friend.</h2>
          <p>One line of Markdown. An entire tiny personality.</p>
          <Link className="button primary" href="/#adopt">Find my crab <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <footer className="footer wrap">
        <Link className="brand" href="/">shell-pet<span className="brand-dot">.</span></Link>
        <p>Open source. Made for the little projects, too.</p>
        <a className="github-link" href="https://github.com/amhtutt/shell-pet-studio">GitHub <span aria-hidden="true">↗</span></a>
      </footer>
    </>
  );
}
