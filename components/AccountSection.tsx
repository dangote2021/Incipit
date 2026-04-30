"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <AccountSection /> — bloc dans /profile pour gérer auth + push.
//
// 3 zones :
//   1. Compte : email connecté, lien "se déconnecter" / "se connecter".
//   2. Sync : indicateur "données synchro multi-device".
//   3. Push notifs : toggle qui appelle subscribe/unsubscribe.
//
// Si Supabase n'est pas configuré → on cache le bloc (localStorage only,
// rien à exposer côté UI).
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, signOut } from "@/lib/supabase/use-auth";
import {
  getPushStatus,
  subscribePush,
  unsubscribePush,
  type PushStatus,
} from "@/lib/web-push";

export default function AccountSection() {
  const { user, ready, configured } = useAuth();
  const [push, setPush] = useState<PushStatus>({
    supported: false,
    permission: "default",
    subscribed: false,
  });
  const [pushBusy, setPushBusy] = useState(false);
  const [pushNote, setPushNote] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Charge l'état du push au montage et quand le user change.
  useEffect(() => {
    let mounted = true;
    getPushStatus().then((s) => {
      if (mounted) setPush(s);
    });
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Si Supabase n'est pas câblé, on ne montre pas la section
  // (l'app reste en mode V1 localStorage, pas de prise de tête côté UI).
  if (!ready) return null;
  if (!configured) return null;

  const togglePush = async () => {
    setPushBusy(true);
    setPushNote(null);
    try {
      if (push.subscribed) {
        await unsubscribePush();
      } else {
        const r = await subscribePush();
        if (!r.ok) {
          if (r.reason === "no_vapid_key") {
            setPushNote("Push pas activé sur ce déploiement.");
          } else if (r.reason === "permission_denied") {
            setPushNote("Tu as refusé les notifs — réactive depuis le navigateur.");
          } else if (r.reason === "unsupported") {
            setPushNote("Push pas supporté sur ce navigateur.");
          } else {
            setPushNote("Échec, réessaie plus tard.");
          }
        }
      }
      const next = await getPushStatus();
      setPush(next);
    } finally {
      setPushBusy(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      // Reload pour purger les états en mémoire (sync engine etc.)
      if (typeof window !== "undefined") window.location.reload();
    }
  };

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
        Compte & sync
      </h2>

      <div className="bg-paper border border-ink/10 rounded-2xl divide-y divide-ink/10">
        {/* Connexion */}
        <div className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-bordeaux/10 flex items-center justify-center text-bordeaux text-lg shrink-0">
            {user ? "✓" : "·"}
          </div>
          <div className="flex-1 min-w-0">
            {user ? (
              <>
                <div className="text-[11px] uppercase tracking-widest font-bold text-ink/50">
                  Connecté
                </div>
                <div className="font-serif text-[15px] text-ink truncate">
                  {user.email || "Compte Incipit"}
                </div>
              </>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-widest font-bold text-ink/50">
                  Hors ligne
                </div>
                <div className="font-serif text-[15px] text-ink/80">
                  Connecte-toi pour synchroniser sur tous tes appareils.
                </div>
              </>
            )}
          </div>
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-[11px] uppercase tracking-widest font-bold text-ink/60 hover:text-bordeaux transition disabled:opacity-50"
            >
              {signingOut ? "…" : "Déco."}
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="bg-ink text-paper px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold hover:bg-bordeaux transition"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* Sync indicator */}
        {user && (
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sage/15 flex items-center justify-center text-sage text-lg shrink-0">
              ⇅
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-widest font-bold text-ink/50">
                Sync activée
              </div>
              <div className="font-serif text-[15px] text-ink/80">
                Favoris, streak et préférences synchro entre appareils.
              </div>
            </div>
          </div>
        )}

        {/* Push toggle */}
        {push.supported && (
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center text-gold text-lg shrink-0">
              ◐
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-widest font-bold text-ink/50">
                Notification quotidienne
              </div>
              <div className="font-serif text-[15px] text-ink/80">
                {push.subscribed
                  ? "L'incipit du jour t'arrive chaque matin."
                  : "Active pour recevoir l'incipit du jour."}
              </div>
              {pushNote && (
                <div className="text-[11px] text-bordeaux mt-1">{pushNote}</div>
              )}
            </div>
            <button
              type="button"
              onClick={togglePush}
              disabled={pushBusy}
              aria-pressed={push.subscribed}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                push.subscribed ? "bg-bordeaux" : "bg-ink/15"
              } disabled:opacity-50`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-paper shadow transition ${
                  push.subscribed ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
