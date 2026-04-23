"use client";

import { useEffect, useState } from "react";

// ─── Indicateur "X / N" flottant en haut-droite du feed vertical.
// ─── Retour panel v9 (Léa) : dans un scroll-snap, on perd vite le
// ─── repère "où je suis / combien il reste".
//
// Technique :
//  1. À l'hydratation, on trouve le <main> scroll-snap parent via
//     querySelector('main.snap-y').
//  2. On compte les enfants directs (chaque snap-start = 1 slide).
//  3. IntersectionObserver suit la slide la plus visible pour mettre à
//     jour l'index courant.
//
// On le cache si total <= 1 (pas d'intérêt), et on fade-in seulement
// après le premier scroll pour ne pas distraire au premier paint.
export default function FeedProgress() {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const main = document.querySelector("main.snap-y") as HTMLElement | null;
    if (!main) return;

    // Les sections snap-start sont soit directement children, soit
    // enfants d'un fragment/wrapper. On prend tous les descendants qui
    // ont une classe contenant "snap-start".
    const sections = Array.from(
      main.querySelectorAll<HTMLElement>('[class*="snap-start"]')
    ).filter((el) => {
      // Filtre les sections imbriquées (ex: une carte avec snap à
      // l'intérieur d'une autre). On ne garde que celles directement
      // scrollables par le main.
      return el.offsetHeight >= window.innerHeight * 0.5;
    });
    if (sections.length <= 1) return;
    setTotal(sections.length);

    const io = new IntersectionObserver(
      (entries) => {
        // On prend l'entrée la plus visible (intersectionRatio max).
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (!best || e.intersectionRatio > best.intersectionRatio) {
            best = e;
          }
        }
        if (best && best.isIntersecting) {
          const idx = sections.indexOf(best.target as HTMLElement);
          if (idx >= 0) setIndex(idx);
        }
      },
      { root: main, threshold: [0.3, 0.6, 0.9] }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      if (!scrolled) setScrolled(true);
    };
    main.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      main.removeEventListener("scroll", onScroll);
    };
  }, [scrolled]);

  if (total <= 1) return null;

  return (
    <div
      aria-hidden
      className={`fixed top-16 right-5 z-30 pointer-events-none transition-opacity duration-500 ${
        scrolled ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="px-2.5 py-1 rounded-full bg-ink/80 text-paper backdrop-blur-sm text-[10px] font-mono font-bold tracking-wider">
        {index + 1} / {total}
      </div>
    </div>
  );
}
