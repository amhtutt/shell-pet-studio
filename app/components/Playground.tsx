"use client";

import { useMemo, useState } from "react";

type Layout = "wide" | "square";
type Theme = "light" | "dark";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shell-pet.vercel.app";

function parseRepo(input: string): [string, string] | null {
  const m = input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\.git$/, "")
    .match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/);
  return m ? [m[1], m[2]] : null;
}

export function Playground() {
  const [input, setInput] = useState("vercel/next.js");
  const [repo, setRepo] = useState<[string, string]>(["vercel", "next.js"]);
  const [layout, setLayout] = useState<Layout>("wide");
  const [theme, setTheme] = useState<Theme>("light");
  const [copied, setCopied] = useState(false);
  const invalid = input.trim() !== "" && !parseRepo(input);

  const [owner, name] = repo;
  const query = layout === "square" ? "?layout=square" : "";
  const snippet = `[![shell-pet](${ORIGIN}/api/pet/${owner}/${name}.svg${query})](https://github.com/${owner}/${name})`;
  const src = useMemo(
    () => `/api/pet/${owner}/${name}.svg?layout=${layout}&theme=${theme}&size=lg`,
    [owner, name, layout, theme],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseRepo(input);
    if (parsed) setRepo(parsed);
  }

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
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

      <div className="mt-8 flex flex-col items-center">
        <div className={`rounded-3xl p-4 sm:p-6 ${theme === "dark" ? "bg-[#0d1117]" : "bg-foam"} border-[3px] border-ink`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={`shell-pet badge for ${owner}/${name}`}
            className={layout === "wide" ? "w-full max-w-[640px] h-auto" : "w-48 h-48"}
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3" role="group" aria-label="Preview options">
          <Toggle label="Layout" value={layout} options={["wide", "square"]} onChange={setLayout} />
          <Toggle label="Preview on" value={theme} options={["light", "dark"]} onChange={setTheme} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-[3px] border-ink bg-ink text-foam">
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/15">
          <span className="text-sm opacity-80">Paste into README.md</span>
          <button onClick={copy} className="rounded-lg bg-foam/10 px-3 py-1 text-sm font-bold hover:bg-foam/20">
            {copied ? "Copied" : "Copy snippet"}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
          <code>{snippet}</code>
        </pre>
      </div>
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
