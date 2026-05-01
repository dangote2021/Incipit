"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <ThemeToggle /> — bascule entre light, dark et système.
//
// Stratégie minimale : pas de dépendance externe (next-themes évité).
// On lit / écrit directement `incipit-theme` dans localStorage et on
// toggle la classe `.dark` sur <html>.
//
// Le script bloquant dans <head> (cf. components/ThemePreScript.tsx)
// applique la bonne classe AVANT le 1er paint pour éviter le flash.
//
// Trois états cycliques au clic : light → dark → system → light...
//   - light  : force clair
//   - dark   : force sombre
//   - system : suit prefers-color-scheme du device (defaut)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "incipit-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const systemDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && systemDark);
  root.classList.toggle("dark", dark);
  // Met à jour la meta theme-color pour la status bar PWA + Android.
  const meta = document.querySelector(
    'meta[name="theme-color"]'
  ) as HTMLMetaElement | null;
  if (meta) meta.setAttribute("content", dark ? "#0F0F1A" : "#FAF7F0");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // On hydrate à `null` puis on lit le localStorage côté client pour éviter
  // tout mismatch SSR / CSR (Next 14 strict).
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let stored: Theme = "system";
    try {
      const raw = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (raw === "light" || raw === "dark" || raw === "system") stored = raw;
    } catch {
      /* localStorage indispo (private mode) — on reste sur system */
    }
    setTheme(stored);

    // Réagit aux changements de prefers-color-scheme tant qu'on est en mode
    // "system" — l'utilisateur change son OS en dark, l'app suit.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const cur = (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system";
      if (cur === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function cycle() {
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
  }

  // Évite le flash d'un mauvais icone pendant l'hydratation.
  if (theme === null) {
    return (
      <span
        aria-hidden
        className={`inline-block w-9 h-9 ${className}`}
      />
    );
  }

  const label =
    theme === "light"
      ? "Mode clair (cliquer pour passer en sombre)"
      : theme === "dark"
      ? "Mode sombre (cliquer pour passer en système)"
      : "Mode système (cliquer pour passer en clair)";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-ink/70 hover:text-bordeaux hover:bg-ink/5 transition ${className}`}
    >
      {theme === "light" && (
        // Soleil
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
      {theme === "dark" && (
        // Lune
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {theme === "system" && (
        // Écran (auto)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      )}
    </button>
  );
}
