"use client";

import { useEffect, useState } from "react";

// Card d'aide à l'installation PWA pour les users iPhone.
// Affichée uniquement si :
//   - device iOS (iPhone/iPad)
//   - navigateur Safari (pas Chrome/Firefox iOS qui n'ont pas le menu "Sur l'écran d'accueil")
//   - pas déjà en mode standalone (app déjà installée)
// Sur tout autre device, le composant ne rend rien (null).
// Raison d'être : tant que l'app n'est pas sur l'App Store, les iPhone users
// peuvent avoir l'expérience "vraie app" via l'ajout à l'écran d'accueil.
export default function IOSInstallCard() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !("MSStream" in window);
    const isChromeiOS = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    const isSafari = /Safari/.test(ua) && !isChromeiOS;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setShow(isIOS && isSafari && !isStandalone);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-paper border-2 border-bordeaux/15 rounded-2xl p-5 mb-4">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full bg-bordeaux/10 flex items-center justify-center shrink-0"
          aria-hidden
        >
          {/* Icône "share" minimale, pas d'emoji pour rester dans la charte */}
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path
              d="M12 3v12M12 3l-4 4M12 3l4 4"
              stroke="#8B1E3F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
              stroke="#8B1E3F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-1">
            Sur iPhone
          </div>
          <div className="font-serif text-lg font-black text-ink leading-tight mb-1">
            Ajoute Incipit à ton écran d&apos;accueil
          </div>
          <div className="text-sm text-ink/70 leading-relaxed mb-3">
            L&apos;app officielle iOS arrive bientôt. En attendant, tu peux
            épingler Incipit comme une vraie app en 2 tap.
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs uppercase tracking-widest font-bold text-bordeaux"
          >
            {expanded ? "Masquer le tuto" : "Comment faire →"}
          </button>
        </div>
      </div>
      {expanded && (
        <ol className="mt-4 pl-4 space-y-2.5 text-sm text-ink/80 leading-relaxed list-decimal list-inside">
          <li>
            En bas de Safari, appuie sur le bouton{" "}
            <strong>Partager</strong> (carré avec flèche vers le haut).
          </li>
          <li>
            Fais défiler le menu et choisis{" "}
            <strong>« Sur l&apos;écran d&apos;accueil »</strong>.
          </li>
          <li>
            Appuie sur <strong>Ajouter</strong> en haut à droite. L&apos;icône
            Incipit apparaît sur ton écran d&apos;accueil, et s&apos;ouvre en
            plein écran comme une vraie app.
          </li>
        </ol>
      )}
    </div>
  );
}
