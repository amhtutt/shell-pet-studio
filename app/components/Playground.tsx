"use client";

import { useEffect, useState } from "react";
import { parseRepoInput } from "@/lib/repo";

type Layout = "wide" | "square";
type Theme = "light" | "dark";
type Status = "loading" | "ok" | "missing" | "unavailable" | "error";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shell-pet.vercel.app";

const STATUS_TEXT: Record<Exclude<Status, "ok">, string> = {
  loading: "Finding your crab…",
  missing: "We couldn't find that repository. Check the spelling, and note that private repos aren't supported.",
  unavailable: "GitHub is busy right now, so this crab is resting. Try again in a few minutes.",
  error: "The preview didn't load. Check your connection and try again.",
};

/** Fetch the badge ourselves so we can read why the crab looks the way it does from the response headers. */
function useBadge(src: string) {
  const [state, setState] = useState<{ url: string | null; status: Status; reason: string | null }>({
    url: null,
    status: "loading",
    reason: null,
  });
  useEffect(() => {
    let url: string | null = null;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, status: "loading" }));
    fetch(src, { signal: ctrl.signal })
      .then(async (res) => {
        url = URL.createObjectURL(await res.blob());
        const status = (res.headers.get("X-Shell-Pet-Status") as Status | null) ?? "ok";
        setState({ url, status, reason: res.headers.get("X-Shell-Pet-Reason") });
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setState({ url: null, status: "error", reason: null });
      });
    return () => {
      ctrl.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);
  return state;
}

export function Playground() {
  const [input, setInput] = useState("amhtutt/shell-pet-studio");
  const [repo, setRepo] = useState({ owner: "vercel", repo: "next.js" });
  const [layout, setLayout] = useState<Layout>("wide");
  const [theme, setTheme] = useState<Theme>("light");
  const [copyMsg, setCopyMsg] = useState("");
  const invalid = input.trim() !== "" && !parseRepoInput(input);

  const { owner, repo: name } = repo;
  const query = layout === "square" ? "?layout=square" : "";
  const snippet = `[![shell-pet](${ORIGIN}/api/pet/${owner}/${name}.svg${query})](https://github.com/${owner}/${name})`;
  const badge = useBadge(`/api/pet/${owner}/${name}.svg?layout=${layout}&theme=${theme}&size=lg`);
  const [w, h] = layout === "wide" ? [640, 160] : [192, 192];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseRepoInput(input);
    if (parsed) setRepo(parsed);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyMsg("Copied");
    } catch {
      setCopyMsg("Couldn't copy. Select the text below and copy it yourself.");
    }
    setTimeout(() => setCopyMsg(""), 2500);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="repo" className="sr-only">
          GitHub repository
        </label>
        <input
          id="repo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="owner/repo"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby="repo-hint"
          className="flex-1 rounded-2xl border-[3px] border-ink bg-foam px-5 py-3 font-mono text-lg outline-none focus-visible:outline-coral"
        />
        <button
          type="submit"
          className="rounded-2xl border-[3px] border-ink bg-coral px-6 py-3 font-display text-lg font-bold text-ink shadow-[0_4px_0_var(--ink)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--ink)] transition-transform"
        >
          Find my crab
        </button>
      </form>
      <p id="repo-hint" className={`mt-2 text-sm ${invalid ? "text-[#9b2c14] font-bold" : "opacity-70"}`}>
        {invalid ? "Use owner/repo or a github.com link, like vercel/next.js." : "Public repos only. Same repo, same crab, every time."}
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className={`rounded-3xl p-4 sm:p-6 ${theme === "dark" ? "bg-[#0d1117]" : "bg-foam"} border-[3px] border-ink`}>
          {/* Reserve the badge's size so the page doesn't jump while it loads. */}
          <div className="relative" style={{ width: "100%", maxWidth: w, aspectRatio: `${w} / ${h}` }}>
            {badge.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={badge.url}
                alt={`shell-pet badge for ${owner}/${name}`}
                width={w}
                height={h}
                className={`w-full h-full transition-opacity ${badge.status === "loading" ? "opacity-40" : ""}`}
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-wet-sand/40 animate-pulse" aria-hidden />
            )}
          </div>
        </div>
        <p className="mt-3 min-h-[1.5rem] text-center text-sm" role="status" aria-live="polite">
          {badge.status === "ok" ? (badge.reason ? `Why: ${badge.reason}` : "") : STATUS_TEXT[badge.status]}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-3" role="group" aria-label="Preview options">
          <Toggle label="Layout" value={layout} options={["wide", "square"]} onChange={setLayout} />
          <Toggle label="Preview on" value={theme} options={["light", "dark"]} onChange={setTheme} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-[3px] border-ink bg-ink text-foam">
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/15">
          <span className="text-sm opacity-80">Paste into README.md</span>
          <button onClick={copy} className="rounded-lg bg-foam/10 px-3 py-1 text-sm font-bold hover:bg-foam/20">
            Copy snippet
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
          <code>{snippet}</code>
        </pre>
      </div>
      <p className="mt-2 min-h-[1.25rem] text-sm text-right" role="status" aria-live="polite">
        {copyMsg}
      </p>
    </div>
  );
}

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">{label}</span>
      <div className="flex rounded-full border-[2.5px] border-ink overflow-hidden">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`px-3 py-1 text-sm font-bold capitalize ${value === o ? "bg-ink text-foam" : "bg-foam hover:bg-shallows"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
