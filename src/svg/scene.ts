// Wide-layout backdrop: rounded frame, waves and sand. Sand and waves keep light tones in dark mode.

export const WIDE = { w: 480, h: 120, scene: 264 } as const;

const SCENE_CLIP = `M12 0H${WIDE.scene}V${WIDE.h}H12A12 12 0 0 1 0 ${WIDE.h - 12}V12A12 12 0 0 1 12 0Z`;

function wave(y: number, amp: number, bottom: number): string {
  let d = `M-60 ${y}`;
  for (let x = -60; x < WIDE.scene + 80; x += 60) d += `Q${x + 30} ${y - amp} ${x + 60} ${y}`;
  return `${d}V${bottom}H-60Z`;
}

export function frame(): string {
  return `<rect class="sp-bg" width="${WIDE.w}" height="${WIDE.h}" rx="12"/>`;
}

export function border(): string {
  return `<rect class="sp-bd" x=".75" y=".75" width="${WIDE.w - 1.5}" height="${WIDE.h - 1.5}" rx="11.25" fill="none" stroke-width="1.5"/>`;
}

export function backdrop(): string {
  return (
    `<defs><clipPath id="sp-scene"><path d="${SCENE_CLIP}"/></clipPath></defs>` +
    `<g clip-path="url(#sp-scene)">` +
    `<g class="sp-drift"><path d="${wave(62, 9, 100)}" fill="#A6D6F3"/></g>` +
    `<g class="sp-drift2"><path d="${wave(74, 8, 104)}" fill="#5DAEE3"/></g>` +
    `<path d="M-2 92Q70 82 140 89T268 86V122H-2Z" fill="#F3DFBD"/>` +
    `<g fill="#E1C597"><circle cx="34" cy="108" r="2"/><circle cx="58" cy="114" r="1.6"/><circle cx="190" cy="112" r="2"/><circle cx="236" cy="104" r="1.6"/><circle cx="220" cy="116" r="1.4"/><circle cx="16" cy="98" r="1.4"/></g>` +
    `</g>`
  );
}

