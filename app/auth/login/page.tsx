"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";

// ─────────────────────────────────────────────────────────────────────────────
// /auth/login — écran magic link.
// Pas de mot de passe : l'utilisateur entre son email, on envoie un lien,
// il clique, on le ramène sur /auth/callback puis (selon ?next=) sur la
// page d'origine ou la home.
// ─────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "sent" | "error";

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
        <h1 className="font-serif text-3xl font-black text-ink leading-tight mb-2">
          Retrouve ta bibliothèque.
        </h1>
        <p className="text-sm text-ink/70 leading-relaxed mb-8">
          On t'envoie un lien magique par email. Pas de mot de passe, rien à
          retenir. Ton streak et tes favoris te suivent d'un appareil à l'autre.
        </p>

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
