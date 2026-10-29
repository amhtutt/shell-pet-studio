import Link from "next/link";
import { Playground } from "./components/Playground";

const STAGES = [
  { stage: "egg", stars: "0 ★", label: "Egg" },
  { stage: "juvenile", stars: "1+ ★", label: "Juvenile" },
  { stage: "adult", stars: "20+ ★", label: "Adult" },
  { stage: "elder", stars: "300+ ★", label: "Elder" },
  { stage: "resting", stars: "quiet 180 days", label: "Resting" },
];

const MOODS = [
  { mood: "celebrating", when: "A release or merged PR in the last day" },
  { mood: "grateful", when: "New stars today or yesterday" },
  { mood: "anxious", when: "An open issue has waited two weeks for a reply" },
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
      <section className="relative bg-shallows pt-8 pb-14 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-extrabold tracking-tight">shell-pet</span>
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/gallery" className="hover:underline underline-offset-4">
              Gallery
            </Link>
            <a href="https://github.com/amhtutt/shell-pet" className="hover:underline underline-offset-4">
              GitHub
            </a>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/preview?layout=square&size=lg&mood=happy&lang=TypeScript&seed=7&contributors=4"
            alt=""
            width={160}
            height={160}
            className="w-32 h-32 sm:w-40 sm:h-40 shrink-0"
          />
          <div>
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] text-[clamp(2.6rem,7vw,5rem)]">
              Your repo has a crab.
            </h1>
            <p className="mt-3 text-lg max-w-xl">
              A hermit crab badge for your README. Stars feed it, releases grow its shell, and when things go quiet,
              it takes a nap.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Playground />
        </div>
      </section>

      <div aria-hidden className="bg-shallows overflow-hidden">
        <div className="shoreline tide w-[calc(100%+48px)]" />
      </div>

      {/* Sand: how it works */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">It grows with your stars</h2>
        <p className="mt-3 max-w-xl text-lg">
          An egg until the first star, then a crab with its own shell. More stars mean a bigger crab and a fancier shell.
        </p>
        <ol className="mt-10 grid grid-cols-3 sm:grid-cols-5 gap-4">
          {STAGES.map((s) => (
            <li key={s.stage} className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview(`stage=${s.stage}&mood=happy&seed=7&lang=`)}
                alt={`${s.label} stage`}
                width={160}
                height={160}
                loading="lazy"
                className="w-full h-auto aspect-square"
              />
              <span className="font-display font-bold">{s.label}</span>
              <span className="font-mono text-xs opacity-70">{s.stars}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm opacity-80">
          Its shell grows with each major release and picks up one decoration per contributor: up to 3 on a
          juvenile, up to 8 from adult on. Archived repos, and repos with no commits for 180 days, rest peacefully
          in their shell. Stages follow the current star count, so losing stars can move a crab back a stage.
        </p>
      </section>

      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">It notices what happens</h2>
        <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {MOODS.map((m) => (
            <li key={m.mood} className="flex items-center gap-4 border-b-2 border-wet-sand py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview(`mood=${m.mood}&seed=moods`)} alt="" width={80} height={80} loading="lazy" className="w-20 h-20 shrink-0" />
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
              <img
                src={preview(`lang=${encodeURIComponent(l)}&contributors=0&seed=langs`)}
                alt={`${l} shell`}
                width={160}
                height={160}
                loading="lazy"
                className="w-full h-auto aspect-square"
              />
              <figcaption className="font-mono text-xs">{l}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-sm opacity-80">
          Other languages get a spiral, conch, round or cone shell picked from the repo&apos;s name, with a stripe in
          the language&apos;s GitHub color when we know it. About one repo in 512 hatches a shiny.
        </p>
      </section>

      <footer className="bg-ink text-foam px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 justify-between">
          <code className="font-mono">npx shell-pet init</code>
          <span className="text-sm opacity-70">MIT · made by amhtutt</span>
        </div>
      </footer>
    </main>
  );
}
