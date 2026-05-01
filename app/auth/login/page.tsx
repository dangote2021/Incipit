"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Logo from "@/components/Logo";
import { browserSupabase } from "@/lib/supabase/client";

// ─────────────────────────────────────────────────────────────────────────────
// /auth/login — écran connexion.
//
// Deux chemins possibles :
//  1. Magic link par email (chemin par défaut, pas de mot de passe).
//  2. Google OAuth (un clic, pour ceux qui n'aiment pas l'email).
// Les deux atterrissent sur /auth/callback?code=… qui échange le code
// contre une session, puis redirige sur ?next= ou /.
// ─────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "sent" | "error";
type OAuthStatus = "idle" | "redirecting" | "error";
type OAuthProvider = "google" | "apple";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<{
    [k in OAuthProvider]: OAuthStatus;
  }>({ google: "idle", apple: "idle" });
  const [oauthErr, setOauthErr] = useState<string | null>(null);

  // ─── OAuth (Google + Apple) ─────────────────────────────────────
  // On utilise le client Supabase côté navigateur pour déclencher la
  // redirection vers le provider. Au retour, Supabase ajoute ?code=…
  // sur l'URL de redirectTo, ce qui re-rentre dans notre callback
  // existant (qui échange le code contre une session côté serveur).
  //
  // Apple Sign In est obligatoire dès lors qu'un autre provider tiers
  // est actif (App Store guideline 4.8). On l'expose donc côté flow,
  // l'activation côté Supabase + Apple Developer reste manuelle.
  const handleOAuth = async (provider: OAuthProvider) => {
    setOauthErr(null);
    const supabase = browserSupabase();
    if (!supabase) {
      setOauthStatus((s) => ({ ...s, [provider]: "error" }));
      setOauthErr(
        "Le compte cloud n'est pas encore branché — ton progrès reste sauvegardé sur cet appareil."
      );
      return;
    }
    setOauthStatus((s) => ({ ...s, [provider]: "redirecting" }));
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (error) {
      setOauthStatus((s) => ({ ...s, [provider]: "error" }));
      setOauthErr(
        provider === "google"
          ? "Connexion Google indisponible — vérifie ta connexion ou utilise l'email."
          : "Connexion Apple indisponible — vérifie ta connexion ou utilise l'email."
      );
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), next }),
      });
      if (res.status === 503) {
        setStatus("error");
        setErr(
          "Le compte cloud n'est pas encore branché — ton progrès reste sauvegardé sur cet appareil."
        );
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErr(
          data.error === "invalid_email"
            ? "Email invalide."
            : "Erreur, réessaie dans un moment."
        );
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setErr("Erreur réseau. Réessaie.");
    }
  };

  return (
    <>
      <AppHeader title="Connexion" back />

      <main className="flex-1 px-6 py-10 max-w-md mx-auto w-full">
        {/* Logo de marque — donne du poids visuel à la page d'auth qui
            sinon est trop sèche (juste un input email). */}
        <Logo size={64} className="mb-6" />
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-2">
          Retrouve ta bibliothèque.
        </h1>
        <p className="text-sm text-ink/70 leading-relaxed mb-8">
          On t'envoie un lien magique par email. Pas de mot de passe, rien à
          retenir. Ton streak et tes favoris te suivent d'un appareil à l'autre.
        </p>

        {/* Boutons OAuth — Apple en premier (HIG iOS), puis Google. Placés
            avant le champ email pour les utilisateurs qui veulent éviter
            le ping-pong d'email. Les trois chemins atterrissent sur la
            même session côté serveur. */}
        {status !== "sent" && (
          <div className="mb-6 space-y-3">
            {/* Apple Sign In — obligatoire si un autre provider tiers est
                actif (Apple guideline 4.8). Style Apple HIG : noir sur
                blanc, logo Apple, mêmes proportions. */}
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={oauthStatus.apple === "redirecting"}
              aria-label="Continuer avec Apple"
              className="w-full min-h-[44px] flex items-center justify-center gap-3 bg-ink text-paper py-3 rounded-full text-sm font-bold hover:bg-ink/90 transition disabled:opacity-60"
            >
              <svg
                viewBox="0 0 18 18"
                width="18"
                height="18"
                aria-hidden="true"
                className="shrink-0 -mt-0.5"
              >
                <path
                  fill="currentColor"
                  d="M14.94 13.95c-.27.62-.59 1.2-.97 1.72-.51.71-.93 1.2-1.26 1.47-.5.45-1.04.69-1.62.7-.41 0-.91-.12-1.49-.36-.58-.24-1.11-.36-1.6-.36-.51 0-1.06.12-1.65.36-.59.24-1.07.37-1.43.38-.55.02-1.1-.22-1.65-.72-.36-.3-.8-.81-1.32-1.55-.55-.79-1.01-1.71-1.37-2.76C0.13 11.69-.07 10.6-.07 9.55c0-1.21.26-2.25.79-3.13.41-.7.96-1.26 1.65-1.66.69-.4 1.43-.61 2.23-.62.43 0 1 .14 1.71.4.71.27 1.16.4 1.36.4.15 0 .65-.16 1.49-.47.79-.29 1.46-.41 2.01-.36 1.49.12 2.61.71 3.36 1.78-1.34.81-1.99 1.94-1.98 3.4.01 1.13.42 2.07 1.22 2.81.36.34.77.61 1.22.79-.1.28-.2.55-.31.81zM11.4 1.5c0 .9-.33 1.74-.99 2.51-.79.92-1.74 1.45-2.78 1.37-.01-.11-.02-.22-.02-.34 0-.86.38-1.78 1.05-2.53.34-.38.77-.7 1.29-.95.52-.25 1.01-.39 1.47-.41.01.12.01.24.01.36z"
                />
              </svg>
              {oauthStatus.apple === "redirecting"
                ? "Redirection vers Apple…"
                : "Continuer avec Apple"}
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthStatus.google === "redirecting"}
              aria-label="Continuer avec Google"
              className="w-full min-h-[44px] flex items-center justify-center gap-3 bg-paper border-2 border-ink/15 text-ink py-3 rounded-full text-sm font-bold hover:border-ink/40 transition disabled:opacity-60"
            >
              <svg
                viewBox="0 0 18 18"
                width="18"
                height="18"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  fill="#EA4335"
                  d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48Z"
                />
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.88 10.78A5.41 5.41 0 0 1 3.6 9c0-.62.11-1.22.29-1.78L.96 4.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26Z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.85.86-3.06.86-2.38 0-4.4-1.57-5.13-3.74L.96 13.04C2.44 15.98 5.48 18 9 18Z"
                />
              </svg>
              {oauthStatus.google === "redirecting"
                ? "Redirection vers Google…"
                : "Continuer avec Google"}
            </button>

            {oauthErr && (
              <div
                role="alert"
                aria-live="assertive"
                className="text-sm text-bordeaux bg-bordeaux/5 border border-bordeaux/20 rounded-xl px-4 py-3"
              >
                {oauthErr}
              </div>
            )}

            {/* Séparateur "ou" */}
            <div className="flex items-center gap-3 mt-6 mb-2">
              <span className="flex-1 h-px bg-ink/10" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/40">
                ou par email
              </span>
              <span className="flex-1 h-px bg-ink/10" />
            </div>
          </div>
        )}

        {status !== "sent" ? (
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/60">
                Email
              </span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="send"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.fr"
                className="mt-2 w-full min-h-[44px] rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 font-serif text-[16px] text-ink focus:border-bordeaux outline-none"
              />
            </label>

            {err && (
              <div
                role="alert"
                aria-live="assertive"
                className="text-sm text-bordeaux bg-bordeaux/5 border border-bordeaux/20 rounded-xl px-4 py-3"
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full min-h-[44px] bg-ink text-paper py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-bordeaux transition disabled:opacity-60"
            >
              {status === "sending" ? "Envoi…" : "Recevoir le lien"}
            </button>
          </form>
        ) : (
          <div className="bg-cream border border-dust rounded-2xl p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-2">
              Email envoyé
            </div>
            <p className="font-serif text-lg text-ink leading-snug mb-3">
              Regarde ta boîte — le lien arrive dans une minute.
            </p>
            <p className="text-sm text-ink/70 leading-relaxed">
              Clique dessus pour ouvrir Incipit connecté. Le lien expire après
              une heure.
            </p>
          </div>
        )}

        <div className="mt-10 text-[11px] text-ink/50 leading-relaxed">
          On n'utilise ton email que pour te reconnecter. Pas de newsletter, pas
          de partage tiers. Voir la{" "}
          <Link href="/privacy" className="underline text-bordeaux">
            politique de confidentialité
          </Link>
          .
        </div>
      </main>
    </>
  );
}
