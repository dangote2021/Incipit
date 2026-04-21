import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devine l'incipit · Quiz Incipit",
  description:
    "8 premières lignes, 4 choix, un verdict. Testes-tu tes classiques ? Flaubert, Camus, Zola, Baudelaire et les autres t'attendent.",
  openGraph: {
    title: "Devine l'incipit — le quiz Incipit",
    description:
      "8 incipits tirés des 12 classiques. 4 options. Ton score en version Wordle.",
    url: "/quiz",
    siteName: "Incipit",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Incipit Quiz",
    description: "8 incipits, 4 choix. Tu connais tes classiques ?",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
