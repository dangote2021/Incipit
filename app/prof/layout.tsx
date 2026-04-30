import type { Metadata } from "next";

// Layout dédié au mode prof : on transmet juste les enfants, mais c'est
// l'occasion de poser des metadata SEO ciblées sur la requête « quiz
// littérature à imprimer ».
export const metadata: Metadata = {
  title: "Mode prof · Quiz littéraire imprimable · Incipit",
  description:
    "Génère un quiz littéraire à imprimer pour ta classe en 2 minutes. 6 catégories, 4 époques, jusqu'à 20 questions. Licence Creative Commons BY-NC 4.0, libre de réutilisation pédagogique.",
  openGraph: {
    title: "Mode prof — Quiz littéraire imprimable (CC BY-NC)",
    description:
      "Pour les enseignants de français : un quiz personnalisable, imprimable, libre de réutilisation en classe.",
    url: "/prof",
    siteName: "Incipit",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mode prof Incipit",
    description: "Quiz littéraire imprimable pour la classe — CC BY-NC 4.0",
  },
};

export default function ProfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
