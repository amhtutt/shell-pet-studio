"use client";

import { useEffect, useRef } from "react";
import { studioMarkup } from "@/src/studio-markup";

export default function Studio() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const element = root.current;
    if (!element) return;
    // Reset DOM-owned controls on navigation/Fast Refresh so listeners never accumulate.
    element.innerHTML = studioMarkup;
    import("@/src/app.js").then(({ initializeStudio }) => {
      if (!cancelled) {
        dispose = initializeStudio(element, {
          apiOrigin: "",
          badgeOrigin: "https://shell-pet.vercel.app",
          projectUrl: "https://github.com/amhtutt/shell-pet-studio",
        });
      }
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: studioMarkup }} />;
}
