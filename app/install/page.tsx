// ─────────────────────────────────────────────────────────────────────────────
// /install — instructions d'installation PWA + lien Play Store.
//
// Page publique, indexable, mise en avant depuis le footer et le bandeau
// d'opt-in PWA (FlashToast / WelcomeBanner).
//
// Stratégie produit (mai 2026) :
//   - iPhone / iPad → PWA Safari (pas d'app native iOS)
//   - Android        → Play Store (Capacitor) ou PWA Chrome
//   - Desktop        → PWA Chrome / Edge
//
// Voir aussi : public/manifest.json, app/layout.tsx (appleWebApp), README.md.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Installer Incipit",
  description:
    "Installe Incipit sur ton iPhone, ton Android ou ton ordinateur en 30 secondes. PWA Safari, Google Play, Chrome desktop.",
  alternates: { canonical: "/install" },
  openGraph: {
    title: "Installer Incipit",
    description:
      "Mets Incipit sur ton écran d'accueil — comme une vraie app, sans store sur Apple.",
    type: "article",
  },
};

export default function InstallPage() {
  return (
    <div className="min-h-screen">
      <AppHeader title="Installer" subtitle="iPhone · Android · Desktop" back />

      <section className="px-6 py-10 max-w-xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-3">
          30 secondes chrono
        </div>
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-4">
          Incipit sur ton écran d'accueil
        </h1>
        <p className="text-ink/75 leading-relaxed mb-10">
          Incipit fonctionne comme une vraie app sur ton téléphone. Sur
          iPhone, on passe par Safari (pas besoin d'App Store). Sur Android,
          tu peux choisir le Play Store ou l'install directe depuis Chrome.
        </p>

        {/* ───── iOS / iPadOS ───── */}
        <div className="mb-10 rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="text-2xl">🍎</span>
            <h2 className="font-serif text-xl font-black text-ink">
              iPhone / iPad
            </h2>
          </div>
          <ol className="space-y-3 text-ink/80 leading-relaxed list-decimal list-inside marker:text-bordeaux marker:font-bold">
            <li>
              Ouvre <strong>incipit-navy.vercel.app</strong> dans{" "}
              <strong>Safari</strong> (pas Chrome — Apple impose Safari pour
              installer une PWA).
            </li>
            <li>
              Touche le bouton <strong>Partager</strong> (le carré avec une
              flèche vers le haut, en bas de l'écran).
            </li>
            <li>
              Fais défiler le menu et sélectionne{" "}
              <strong>« Sur l'écran d'accueil »</strong>.
            </li>
            <li>
              Touche <strong>Ajouter</strong> en haut à droite.
            </li>
            <li>
              L'icône Incipit apparaît sur ton écran d'accueil. Lance-la
              depuis là — plus de barre Safari, mode plein écran.
            </li>
          </ol>
          <p className="mt-5 text-[13px] text-ink/55 italic">
            Astuce : connecte-toi avant d'ajouter, ta session est conservée
            dans l'app installée.
          </p>
        </div>

        {/* ───── Android ───── */}
        <div className="mb-10 rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="text-2xl">🤖</span>
            <h2 className="font-serif text-xl font-black text-ink">Android</h2>
          </div>
          <p className="text-ink/80 mb-4">Deux options :</p>

          <div className="rounded-xl bg-bordeaux/5 border border-bordeaux/20 p-4 mb-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bordeaux font-bold mb-2">
              Recommandé
            </div>
            <p className="text-ink/80 leading-relaxed mb-3">
              Installe l'app Android native depuis le Google Play Store —
              mises à jour automatiques, intégration système (notifications
              push, partage natif).
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=app.incipit.reader"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 bg-bordeaux text-paper rounded-full text-sm font-bold tracking-wide hover:opacity-90"
            >
              Voir sur Google Play →
            </a>
            <p className="mt-2 text-[12px] text-ink/55 italic">
              L'app sera publique sur le Play Store au lancement officiel.
              D'ici là, demande l'accès beta via{" "}
              <Link href="/about" className="text-bordeaux underline">
                la page À propos
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border border-ink/10 p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-bold mb-2">
              Alternative — PWA Chrome
            </div>
            <ol className="space-y-2 text-ink/80 list-decimal list-inside marker:text-ink/40">
              <li>
                Ouvre <strong>incipit-navy.vercel.app</strong> dans Chrome.
              </li>
              <li>
                Menu <strong>⋮</strong> en haut à droite →{" "}
                <strong>Installer l'application</strong>.
              </li>
              <li>Confirme. L'icône arrive sur ton home.</li>
            </ol>
          </div>
        </div>

        {/* ───── Desktop ───── */}
        <div className="mb-10 rounded-2xl border border-ink/10 bg-paper p-6">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="text-2xl">💻</span>
            <h2 className="font-serif text-xl font-black text-ink">
              Ordinateur (Chrome, Edge)
            </h2>
          </div>
          <p className="text-ink/80 leading-relaxed">
            Ouvre <strong>incipit-navy.vercel.app</strong>. Une icône
            d'installation apparaît dans la barre d'adresse à droite (un
            écran avec une flèche). Clique dessus, confirme — Incipit
            s'installe comme une app desktop, accessible depuis le Dock /
            Applications / barre des tâches.
          </p>
        </div>

        {/* ───── FAQ courte ───── */}
        <div className="mt-12">
          <h2 className="font-serif text-xl font-black text-ink mb-4">
            Questions courantes
          </h2>
          <details className="mb-3 rounded-lg border border-ink/10 p-4">
            <summary className="cursor-pointer font-bold text-ink">
              Pourquoi pas d'app sur l'App Store iOS ?
            </summary>
            <p className="mt-3 text-ink/75 leading-relaxed">
              Une PWA Safari bien faite couvre 100 % du périmètre Incipit —
              lecture, quiz, push limités, paiement Stripe. Sur Apple, l'App
              Store coûte 99 $/an + 30 % des paiements et impose 3 semaines
              de review. On préfère mettre cet argent et ce temps dans
              l'éditorial. La PWA est techniquement aussi rapide qu'une app
              native pour notre usage.
            </p>
          </details>
          <details className="mb-3 rounded-lg border border-ink/10 p-4">
            <summary className="cursor-pointer font-bold text-ink">
              Et si je n'ai pas Safari sur iPhone ?
            </summary>
            <p className="mt-3 text-ink/75 leading-relaxed">
              Safari est livré préinstallé sur tous les iPhone. Si tu l'as
              désactivé : Réglages → Temps d'écran → Restrictions → Apps
              autorisées → réactive Safari.
            </p>
          </details>
          <details className="mb-3 rounded-lg border border-ink/10 p-4">
            <summary className="cursor-pointer font-bold text-ink">
              Comment désinstaller ?
            </summary>
            <p className="mt-3 text-ink/75 leading-relaxed">
              iOS : appui long sur l'icône → Supprimer l'app. Android (Play
              Store) : appui long → Désinstaller. Android (PWA Chrome) :
              chrome://apps puis clic droit → Désinstaller.
            </p>
          </details>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/10">
          <Link
            href="/"
            className="text-bordeaux underline hover:no-underline text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
