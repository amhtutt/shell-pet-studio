export type Theme = "auto" | "light" | "dark";

const LIGHT = { bg: "#FAF7F2", border: "#E8DFD2", text: "#2B1D1A", muted: "#5B4A44" };
const DARK = { bg: "#16202E", border: "#2A3A50", text: "#E8EDF5", muted: "#B6C2D3" };

const vars = (c: typeof LIGHT) =>
  `.sp-bg{fill:${c.bg}}.sp-bd{stroke:${c.border}}.sp-t1{fill:${c.text}}.sp-t2{fill:${c.muted}}`;

const KEYFRAMES = `
.sp-bob{animation:sp-bob 3s ease-in-out infinite}
@keyframes sp-bob{50%{transform:translateY(-3px)}}
.sp-blink{transform-box:fill-box;transform-origin:center;animation:sp-blink 5s infinite}
@keyframes sp-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.sp-jump{animation:sp-jump 1.1s ease-in-out infinite}
@keyframes sp-jump{0%,100%{transform:translateY(0)}45%{transform:translateY(-16px)}}
.sp-shadow{transform-box:fill-box;transform-origin:center;animation:sp-shadow 1.1s ease-in-out infinite}
@keyframes sp-shadow{45%{transform:scale(.7);opacity:.5}}
.sp-fall{animation:sp-fall 2.6s linear infinite}
@keyframes sp-fall{0%{transform:translateY(-8px) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(44px) rotate(160deg);opacity:0}}
.sp-z{animation:sp-z 3.6s ease-in infinite}
@keyframes sp-z{0%{transform:translate(0,0);opacity:0}25%{opacity:1}100%{transform:translate(10px,-22px);opacity:0}}
.sp-twinkle{transform-box:fill-box;transform-origin:center;animation:sp-twinkle 2.1s ease-in-out infinite}
@keyframes sp-twinkle{50%{transform:scale(.45);opacity:.45}}
.sp-drift{animation:sp-drift 9s ease-in-out infinite alternate}
.sp-drift2{animation:sp-drift 7s ease-in-out infinite alternate-reverse}
@keyframes sp-drift{to{transform:translateX(-30px)}}
.sp-cursor{animation:sp-cursor 1.1s steps(1) infinite}
@keyframes sp-cursor{50%{opacity:0}}
.sp-steam{animation:sp-steam 3s ease-in-out infinite}
@keyframes sp-steam{0%{transform:translateY(4px);opacity:0}40%{opacity:1}100%{transform:translateY(-8px);opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

export function styles(theme: Theme): string {
  const colors =
    theme === "dark"
      ? vars(DARK)
      : theme === "light"
        ? vars(LIGHT)
        : `${vars(LIGHT)}@media (prefers-color-scheme:dark){${vars(DARK)}}`;
  return `<style>${colors}${KEYFRAMES.replace(/\n/g, "")}</style>`;
}
