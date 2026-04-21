import type { MetadataRoute } from "next";
import { BOOKS, CLUBS, RAP_PUNCHLINES, CHALLENGES } from "@/lib/mock-data";

const BASE_URL =
  "https://incipit-git-main-guillaumecoulon1-6957s-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/explore`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/domaine-public`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/punchlines`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/clubs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/feed`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/scan`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/onboarding`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const bookRoutes: MetadataRoute.Sitemap = BOOKS.map((b) => ({
    url: `${BASE_URL}/book/${b.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: b.publicDomain ? 0.85 : 0.75,
  }));

  const clubRoutes: MetadataRoute.Sitemap = CLUBS.map((c) => ({
    url: `${BASE_URL}/clubs/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const buddyRoutes: MetadataRoute.Sitemap = BOOKS.map((b) => ({
    url: `${BASE_URL}/buddy/${b.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Punchlines et challenges sont affichés sur une même page — pas d'URL
  // dédiée pour le moment, mais on pourrait en ajouter. On note le nombre
  // pour refléter la profondeur du contenu.
  void RAP_PUNCHLINES;
  void CHALLENGES;

  return [...staticRoutes, ...bookRoutes, ...clubRoutes, ...buddyRoutes];
}
