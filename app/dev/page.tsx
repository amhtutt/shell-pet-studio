// Contact sheet of every stage / mood / language for eyeballing the renderer.
import { MOODS } from "@/lib/mood";
import { STAGES } from "@/lib/stage";

const LANGS = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "Java", "C++", "Ruby", "Swift", "Shell", "Kotlin", ""];

function Cell({ q, label }: { q: string; label: string }) {
  return (
    <figure className="flex flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/preview?layout=square&size=lg&${q}`} alt={label} width={180} height={180} />
      <figcaption className="text-xs opacity-70">{label}</figcaption>
    </figure>
  );
}

export default function Dev() {
  return (
    <main className="p-6 space-y-10 bg-[#FAF7F2] text-[#2B1D1A] min-h-screen">
      <section>
        <h2 className="font-bold mb-2">Stages</h2>
        <div className="flex flex-wrap gap-3">
          {STAGES.map((s) => <Cell key={s} q={`stage=${s}`} label={s} />)}
        </div>
      </section>
      <section>
        <h2 className="font-bold mb-2">Moods</h2>
        <div className="flex flex-wrap gap-3">
          {MOODS.map((m) => <Cell key={m} q={`mood=${m}`} label={m} />)}
        </div>
      </section>
      <section>
        <h2 className="font-bold mb-2">Languages</h2>
        <div className="flex flex-wrap gap-3">
          {LANGS.map((l) => <Cell key={l} q={`lang=${encodeURIComponent(l)}`} label={l || "none"} />)}
        </div>
      </section>
      <section>
        <h2 className="font-bold mb-2">Seeds + shiny</h2>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <Cell key={s} q={`seed=r${s}&lang=`} label={`seed r${s}`} />)}
          <Cell q="shiny=1&lang=" label="shiny" />
          <Cell q="gift=1" label="gift" />
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-bold mb-2">Wide</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/preview?theme=light" alt="wide light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/preview?theme=dark&stage=juvenile&mood=grateful" alt="wide dark" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/preview?theme=light&stage=elder&mood=celebrating&lang=Rust&owner=facebook&repo=react-native" alt="wide elder" />
      </section>
    </main>
  );
}
