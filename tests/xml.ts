// Minimal well-formedness check: balanced tags and no duplicate attributes (both break camo-served SVGs).
export function xmlProblems(svg: string): string[] {
  const problems: string[] = [];
  const stack: string[] = [];
  const body = svg.replace(/<style>[\s\S]*?<\/style>/g, "<style/>");
  for (const m of body.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    const [, close, name, attrs, self] = m;
    const names = [...attrs.matchAll(/\s([a-zA-Z:-]+)=/g)].map((a) => a[1]);
    const dup = names.find((n, i) => names.indexOf(n) !== i);
    if (dup) problems.push(`duplicate ${dup} on <${name}>`);
    if (close) {
      if (stack.pop() !== name) problems.push(`unbalanced </${name}>`);
    } else if (!self) stack.push(name);
  }
  if (stack.length) problems.push(`unclosed ${stack.join(",")}`);
  return problems;
}
