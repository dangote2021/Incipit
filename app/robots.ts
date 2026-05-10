import type { MetadataRoute } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// robots.txt — politique d'indexation Incipit.
//
// Bloqué : /api/* (endpoints), /feed /library /clubs /profile /buddy/*
// (pages auth-required ou interactives sans contenu indexable utile).
// Le contenu mocké de ces pages serait pollution SEO + risque de
// référencement de fausses signatures users.
//
// Indexable : home, book/*, explore, punchlines, quiz, presse, legal,
// privacy, terms, install, about, debutant, domaine-public, incipit-du-jour.
// ─────────────────────────────────────────────────────────────────────────────
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/feed",
          "/library",
          "/clubs",
          "/clubs/",
          "/profile",
          "/buddy/",
          "/auth/",
          "/onboarding",
          "/scan",
        ],
      },
    ],
    sitemap: "https://incipit-navy.vercel.app/sitemap.xml",
  };
}
