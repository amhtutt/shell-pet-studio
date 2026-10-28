// /dev/view?q=stage=adult&q=mood=sleepy — big previews for close inspection.
export default async function View({ searchParams }: { searchParams: Promise<{ q?: string | string[]; w?: string }> }) {
  const { q = "", w = "380" } = await searchParams;
  const qs = Array.isArray(q) ? q : [q];
  return (
    <main className="flex flex-wrap gap-2 p-2 bg-[#FAF7F2] min-h-screen">
      {qs.map((s) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={s} src={`/api/preview?${s.includes("layout=") ? "" : "layout=square&size=lg&"}${s}`} alt={s} width={Number(w)} />
      ))}
    </main>
  );
}
