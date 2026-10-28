import Link from "next/link";
import { Playground } from "./components/Playground";

const STAGES = [
  { stage: "egg", stars: "0", label: "Egg" },
  { stage: "cracking", stars: "1", label: "Cracking" },
  { stage: "hatchling", stars: "5", label: "Hatchling" },
  { stage: "juvenile", stars: "25", label: "Juvenile" },
  { stage: "adult", stars: "200", label: "Adult" },
  { stage: "elder", stars: "1k", label: "Elder" },
];

const MOODS = [
  { mood: "celebrating", when: "A release or merged PR in the last day" },
  { mood: "grateful", when: "Someone starred it today" },
  { mood: "anxious", when: "30+ open issues, or one unanswered for two weeks" },
  { mood: "curious", when: "A new fork or first-time contributor this week" },
  { mood: "happy", when: "A commit in the last week" },
  { mood: "lonely", when: "Only the owner has shown up for 60 days" },
  { mood: "sleepy", when: "No commits for 30 days" },
  { mood: "sleeping", when: "No commits for 90 days" },
];

const LANGS = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "Java", "C", "Ruby", "Swift", "Shell"];

const preview = (q: string) => `/api/preview?layout=square&size=md&theme=light&${q}`;

export default function Home() {
  return (
    <main>
      {/* Water: the hero and the playground */}
      <section className="relative bg-shallows pt-10 pb-16 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-extrabold tracking-tight">shell-pet</span>
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/gallery" className="hover:underline underline-offset-4">
              Gallery
            </Link>
            <a href="https://github.com/lma0/shell-pet" className="hover:underline underline-offset-4">
              GitHub
            </a>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto mt-14 sm:mt-20 text-center">
          <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.9] text-[clamp(3rem,10vw,7.5rem)]">
            Your repo
            <br />
            has a crab.
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto">
            A hermit crab badge for your README. Stars feed it, releases grow its shell, and if you stop committing,
            it moves out.
          </p>
        </div>

        <div className="mt-12">
          <Playground />
        </div>
      </section>

      <div aria-hidden className="bg-shallows overflow-hidden">
        <div className="shoreline tide w-[calc(100%+48px)]" />
      </div>

      {/* Sand: how it works */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">It grows with your stars</h2>
        <p className="mt-3 max-w-xl text-lg">Every crab starts as an egg. Each stage needs more stars than the last.</p>
        <ol className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-4">
          {STAGES.map((s) => (
            <li key={s.stage} className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview(`stage=${s.stage}&mood=happy`)} alt={`${s.label} stage`} className="w-full h-auto" />
              <span className="font-display font-bold">{s.label}</span>
              <span className="font-mono text-xs opacity-70">{s.stars} ★</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm opacity-80">
          Its shell grows with each major release and picks up one decoration per contributor. Archive the repo or go
          180 days without a commit, and you&apos;ll find an empty shell with a cobweb in it.
        </p>
      </section>

      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">It notices what happens</h2>
        <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {MOODS.map((m) => (
            <li key={m.mood} className="flex items-center gap-4 border-b-2 border-wet-sand py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview(`mood=${m.mood}&seed=moods`)} alt="" className="w-20 h-20 shrink-0" />
              <div>
                <div className="font-display text-lg font-bold capitalize">{m.mood}</div>
                <div className="text-sm">{m.when}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pb-20 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">Its shell is your language</h2>
        <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 gap-4">
          {LANGS.map((l) => (
            <figure key={l} className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview(`lang=${encodeURIComponent(l)}&contributors=0&seed=langs`)} alt={`${l} shell`} className="w-full h-auto" />
              <figcaption className="font-mono text-xs">{l}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-sm opacity-80">
          Other languages get a seeded spiral, conch, round or cone shell in their GitHub color. About one repo in
          512 hatches a shiny.
        </p>
      </section>

      <footer className="bg-ink text-foam px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 justify-between">
          <code className="font-mono">npx shell-pet init</code>
          <span className="text-sm opacity-70">MIT · made by lma0</span>
        </div>
      </footer>
    </main>
  );
}
