"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { usePremium, FEATURES, formatTrialRemaining } from "@/lib/premium";
import { useAuth } from "@/lib/supabase/use-auth";

// ─── Page /premium : paywall — Stripe checkout si configuré, sinon
// ─── activate local (pour la démo). Le portail (cancel) est wired aussi.
export default function PremiumPage() {
  return (
    <Suspense fallback={null}>
      <PremiumInner />
    </Suspense>
  );
}

function PremiumInner() {
  const params = useSearchParams();
  const stripeSuccess = params.get("success") === "1";
  const stripeCanceled = params.get("canceled") === "1";
  const { isPremium, activatedAt, trialEndsAt, activate, deactivate, hydrated } =
    usePremium();
  const { user, configured: authConfigured } = useAuth();
  const router = useRouter();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setCheckoutError(null);

    // Si Supabase n'est pas câblé → pas de Stripe possible, on retombe sur
    // l'activation locale (mode démo / V1).
    if (!authConfigured) {
      activate();
      return;
    }

    // Pas connecté → on dirige vers le login en gardant le retour vers /premium.
    if (!user) {
      router.push("/auth/login?next=/premium");
      return;
    }

    setCheckoutBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.status === 503) {
        // Backend Stripe pas configuré → fallback démo.
        activate();
        return;
      }
      if (!res.ok) {
        setCheckoutError("Impossible de démarrer le paiement, réessaie.");
        return;
      }
      const json = (await res.json()) as { url?: string };
      if (json.url) {
        window.location.href = json.url;
      } else {
        setCheckoutError("Réponse invalide du serveur.");
      }
    } catch (e) {
      console.warn("[premium] checkout error:", e);
      setCheckoutError("Connexion impossible, réessaie plus tard.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  const handleManage = async () => {
    if (!authConfigured || !user) {
      deactivate();
      return;
    }
    setPortalBusy(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        deactivate();
        return;
      }
      const json = (await res.json()) as { url?: string };
      if (json.url) {
        window.location.href = json.url;
      } else {
        deactivate();
      }
    } catch {
      deactivate();
    } finally {
      setPortalBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-cream to-dust">
      <AppHeader title="Premium" subtitle="Débloquer l'app au complet" back />

      {/* Bandeau retour Stripe — afficher feedback paiement. */}
      {stripeSuccess && (
        <section className="px-6 pt-4">
          <div className="rounded-2xl border-2 border-sage/40 bg-sage/10 px-4 py-3 text-sm">
            <div className="text-[10px] uppercase tracking-[0.25em] text-sage font-bold">
              Paiement reçu
            </div>
            <div className="font-serif text-ink mt-1">
              Bienvenue dans Premium. Ton accès est activé — bonne lecture.
            </div>
          </div>
        </section>
      )}
      {stripeCanceled && (
        <section className="px-6 pt-4">
          <div className="rounded-2xl border-2 border-bordeaux/30 bg-bordeaux/5 px-4 py-3 text-sm">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bordeaux font-bold">
              Paiement annulé
            </div>
            <div className="font-serif text-ink mt-1">
              Pas de débit. Tu peux réessayer quand tu veux.
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="px-6 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute top-20 -left-10 w-40 h-40 rounded-full bg-bordeaux/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-[10px] uppercase tracking-[0.25em] text-gold font-black">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Incipit Premium
          </div>
          <h1 className="font-serif text-4xl font-black text-ink leading-tight mt-4">
            Lire sans fin.
            <br />
            <span className="text-bordeaux">Sans limite.</span>
          </h1>
          <p className="font-serif text-lg leading-relaxed text-ink/80 mt-4">
            Même app, même vibe. Juste plus de souffle. Enchaîne les quiz,
            remonte dans l'archive des incipits, dévore les punchlines — on te
            coupe plus au milieu d'un Zola.
          </p>
        </div>
      </section>

      {/* État actuel */}
      {hydrated && (
        <section className="px-6 pb-8">
          {isPremium ? (
            <div className="bg-ink text-paper rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
                    Tu es Premium
                  </div>
                  <div className="font-serif text-xl font-bold mt-1">
                    Bienvenue dans l'édition complète.
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold text-2xl">
                  ★
                </div>
              </div>
              {trialEndsAt && (
                <div className="mt-4 text-sm text-paper/70 italic">
                  {formatTrialRemaining(trialEndsAt)}
                </div>
              )}
              {activatedAt && (
                <div className="mt-1 text-[11px] uppercase tracking-wider text-paper/50">
                  Membre depuis le{" "}
                  {new Date(activatedAt).toLocaleDateString("fr-FR")}
                </div>
              )}
              <button
                onClick={handleManage}
                disabled={portalBusy}
                className="mt-6 w-full text-center border border-paper/20 text-paper/70 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold hover:text-paper hover:border-paper/50 transition disabled:opacity-50"
              >
                {portalBusy ? "Ouverture du portail…" : "Gérer mon abonnement"}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleSubscribe}
                disabled={checkoutBusy}
                className="w-full bg-gold text-ink rounded-3xl p-6 shadow-xl hover:bg-gold/90 transition text-left disabled:opacity-60"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] font-black">
                  7 jours offerts
                </div>
                <div className="font-serif text-2xl font-black mt-1">
                  {checkoutBusy ? "Préparation…" : "Activer Premium"}
                </div>
                <div className="text-sm mt-2 opacity-80">
                  {authConfigured
                    ? "Paiement sécurisé via Stripe. Résiliable en 2 clics."
                    : "Résiliable en 2 clics. (Démo locale — paiement pas branché.)"}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold">
                  {checkoutBusy ? "…" : "Débloquer maintenant →"}
                </div>
              </button>
              {checkoutError && (
                <p className="mt-3 text-center text-xs text-bordeaux">
                  {checkoutError}
                </p>
              )}
              {authConfigured && !user && (
                <p className="mt-3 text-center text-[11px] text-ink/60 italic">
                  Tu seras redirigé pour te connecter avant le paiement.
                </p>
              )}
            </>
          )}
        </section>
      )}

      {/* ─── Tarifs indicatifs — retour panel v9 (Aïssatou) : sans prix
          visible, le CTA paraissait un piège. On affiche 3 paliers avec
          mention explicite "prix indicatif, lancement Q3" pour rester
          honnête en bêta. */}
      {!isPremium && (
        <section className="px-6 pb-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
            Tarifs · lancement prévu Q3 2026
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-paper border border-ink/10 rounded-2xl p-5 flex items-baseline justify-between">
              <div>
                <div className="font-serif text-lg font-black text-ink">
                  Mensuel
                </div>
                <div className="text-xs text-ink/60 mt-0.5">
                  Sans engagement, résiliable en 2 clics.
                </div>
              </div>
              <div className="font-serif text-2xl font-black text-ink shrink-0 ml-3">
                4,99 €
                <span className="text-xs font-normal text-ink/50"> / mois</span>
              </div>
            </div>

            <div className="bg-ink text-paper rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gold/20 blur-2xl" />
              <div className="relative flex items-baseline justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-serif text-lg font-black">Annuel</div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-black bg-gold/15 border border-gold/40 px-2 py-0.5 rounded-full">
                      Économise 33 %
                    </span>
                  </div>
                  <div className="text-xs text-paper/70 mt-0.5">
                    Soit 3,33 € / mois. Notre recommandation.
                  </div>
                </div>
                <div className="font-serif text-2xl font-black shrink-0 ml-3">
                  39,99 €
                  <span className="text-xs font-normal text-paper/50"> / an</span>
                </div>
              </div>
            </div>

            <div className="bg-paper border border-bordeaux/30 rounded-2xl p-5 flex items-baseline justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-serif text-lg font-black text-ink">
                    À vie
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-bordeaux font-black">
                    Premier cercle
                  </span>
                </div>
                <div className="text-xs text-ink/60 mt-0.5">
                  Tu payes une fois, tu as tout, pour toujours.
                </div>
              </div>
              <div className="font-serif text-2xl font-black text-bordeaux shrink-0 ml-3">
                79 €
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-ink/50 italic">
            Prix indicatifs — aucun paiement n'est activé pendant la bêta. Les
            tarifs définitifs seront annoncés avant l'ouverture du paiement,
            et les membres bêta auront accès à une remise fondatrice.
          </p>
        </section>
      )}

      {/* Ce qui change */}
      <section className="px-6 pb-10">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/50 font-bold mb-4">
          Ce qui change avec Premium
        </div>
        <div className="space-y-3">
          {Object.values(FEATURES).map((f) => (
            <div
              key={f.id}
              className="bg-paper/70 backdrop-blur border border-ink/10 rounded-2xl p-4"
            >
              <div className="font-serif text-lg font-black text-ink">
                {f.label}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">
                    Gratuit
                  </div>
                  <div className="text-ink/70 mt-1">{f.free}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    Premium
                  </div>
                  <div className="text-ink font-medium mt-1">{f.premium}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ce qui ne change pas */}
      <section className="px-6 pb-10">
        <div className="bg-bordeaux/5 border border-bordeaux/20 rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-black mb-2">
            Ce qui ne change pas
          </div>
          <ul className="space-y-2 text-sm text-ink/80 font-serif">
            <li>· Pas de pub, jamais — même en gratuit.</li>
            <li>· Pas de notifs agressives. Premium ou pas.</li>
            <li>· Pas de gamification qui infantilise.</li>
            <li>· Tes données restent chez toi (localStorage).</li>
          </ul>
        </div>
      </section>

      {/* Retour */}
      <section className="px-6 pb-12">
        <Link
          href="/"
          className="block w-full text-center border border-ink/20 text-ink py-3 rounded-full text-[11px] uppercase tracking-widest font-bold bg-paper/60 backdrop-blur-sm hover:border-bordeaux hover:text-bordeaux transition"
        >
          Retour à l'accueil
        </Link>
      </section>
    </div>
  );
}
