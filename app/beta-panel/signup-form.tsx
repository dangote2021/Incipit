"use client";

import { useState } from "react";

export default function BetaSignupForm({ inviteCode }: { inviteCode?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") || "").trim().toLowerCase(),
      full_name: String(fd.get("full_name") || "").trim(),
      motivation: String(fd.get("motivation") || "").trim(),
      device_android: fd.get("device_android") === "on",
      device_ios: fd.get("device_ios") === "on",
      google_play_email: String(fd.get("google_play_email") || "").trim().toLowerCase(),
      invited_by_code: inviteCode ?? null,
    };

    if (!payload.email || !/.+@.+\..+/.test(payload.email)) {
      setError("Adresse email invalide.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/beta/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "already_registered") {
          setError("Tu as déjà candidaté avec cet email.");
        } else if (data.error === "service_not_configured") {
          setError("Beta panel pas encore actif. Réessaie plus tard.");
        } else {
          setError("Échec de l'envoi. Réessaie ou écris à guillaumecoulon1@gmail.com.");
        }
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-serif text-2xl font-black text-ink mb-2">
          Candidature envoyée
        </h3>
        <p className="text-sm text-ink/70">
          On revient vers toi sous 48 h sur l&apos;email indiqué.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" name="email" type="email" required />
      <Field label="Prénom et nom" name="full_name" required />

      <div>
        <label
          htmlFor="motivation"
          className="block text-[10px] uppercase tracking-[0.25em] font-bold text-ink/55 mb-1"
        >
          Pourquoi toi ?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          maxLength={500}
          required
          placeholder="Tes 3 derniers livres lus, ton émission littéraire favorite, ce que tu attends d'Incipit…"
          className="w-full px-3 py-2.5 border border-ink/15 rounded-xl bg-paper text-ink placeholder:text-ink/35 focus:outline-none focus:border-bordeaux text-sm leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.25em] font-bold text-ink/55 mb-2">
          Sur quel appareil tu testes ?
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink/85">
            <input type="checkbox" name="device_android" /> Android (Play Store
            beta)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/85">
            <input type="checkbox" name="device_ios" /> iPhone / iPad (PWA Safari)
          </label>
        </div>
      </div>

      <Field
        label="Email Google Play (si Android)"
        name="google_play_email"
        type="email"
        helper="L'email Google associé à ton téléphone Android. Sert à t'ajouter à la liste de test sur Play Console."
      />

      {error && (
        <p role="alert" className="text-sm text-bordeaux italic">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3.5 bg-ink text-paper rounded-full text-[11px] uppercase tracking-widest font-black hover:bg-bordeaux transition disabled:opacity-50"
      >
        {submitting ? "Envoi…" : "Candidater à la beta"}
      </button>

      <p className="text-[11px] text-ink/45 leading-relaxed">
        Ton email est utilisé uniquement pour le programme beta. Désinscription
        à tout moment via /api/me/delete ou par mail.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  helper,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] uppercase tracking-[0.25em] font-bold text-ink/55 mb-1"
      >
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoCapitalize={type === "email" ? "none" : undefined}
        autoCorrect={type === "email" ? "off" : undefined}
        spellCheck={type === "email" ? false : undefined}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-xl bg-paper text-ink focus:outline-none focus:border-bordeaux text-sm"
      />
      {helper && (
        <p className="mt-1 text-[11px] text-ink/50 leading-relaxed">{helper}</p>
      )}
    </div>
  );
}
