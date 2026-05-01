import type { Config } from "tailwindcss";

// ─── Mode sombre via CSS variables ─────────────────────────────────────────
//
// Stratégie : `darkMode: "class"` + couleurs définies via variables CSS sur
// :root (light) et .dark (dark), exprimées en triplets RGB pour permettre
// `<alpha-value>` (Tailwind injecte l'opacité automatiquement).
//
// Avantages :
//   - Aucun composant à modifier : `bg-paper`, `text-ink`, `border-ink/5`
//     fonctionnent dans les 2 modes sans variant `dark:` partout.
//   - Pas de dépendance externe (next-themes évité — un script bloquant
//     de 12 lignes dans <head> suffit pour l'anti-flash SSR).
//   - Roll-back facile : il suffit de retirer la classe `.dark` du <html>.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)",         // texte principal
        paper: "rgb(var(--c-paper) / <alpha-value>)",     // fond
        bordeaux: "rgb(var(--c-bordeaux) / <alpha-value>)", // accent rouge
        gold: "rgb(var(--c-gold) / <alpha-value>)",       // dorure
        sage: "rgb(var(--c-sage) / <alpha-value>)",       // vert biblio
        cream: "rgb(var(--c-cream) / <alpha-value>)",     // surface card
        dust: "rgb(var(--c-dust) / <alpha-value>)",       // borders / surf2
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
