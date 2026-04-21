import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import CapacitorBridge from "@/components/CapacitorBridge";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://incipit-navy.vercel.app"),
  title: {
    default: "Incipit — Les premières lignes qui donnent envie",
    template: "%s · Incipit",
  },
  description:
    "L'app qui redonne envie de lire les classiques. Pitches Boloss, passages clés, book clubs, reading buddies, Rap & Lit, domaine public. Sobre, anti-gamification, pro-plaisir.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Incipit",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "Incipit — Les premières lignes qui donnent envie",
    description:
      "Les classiques pitchés comme ils méritent. Pitches Boloss, passages clés, book clubs, punchlines rap décortiquées, lecture gratuite domaine public.",
    url: "/",
    siteName: "Incipit",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Incipit — Les classiques qui donnent envie de lire",
    description:
      "Booba cite Baudelaire. Flaubert c'est Desperate Housewives avant l'heure. Les classiques t'attendent.",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "littérature",
    "classiques français",
    "book club",
    "lecture",
    "Flaubert",
    "Zola",
    "Hugo",
    "Baudelaire",
    "Rimbaud",
    "domaine public",
  ],
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen paper-texture">
        <div className="max-w-xl mx-auto min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <BottomNav />
        <ServiceWorkerRegister />
        <CapacitorBridge />
      </body>
    </html>
  );
}
