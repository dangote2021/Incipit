"use client";

// ─────────────────────────────────────────────────────────────────────────────
// <ProfileEditor /> — éditeur inline pour le bloc profil de /profile.
//
// Pourquoi inline et pas un modal ?
//   - Pas de gestion de focus trap, escape key, scroll lock
//   - L'user voit le résultat immédiatement (la carte se transforme)
//   - Cohérent avec le reste de l'app (sobre, pas de overlays)
//
// Champs édités : avatar (emoji unique), name, handle, bio.
// Persistance : updatePrefs() — lit/écrit localStorage + déclenche sync.
// Pas de validation côté UI au-delà des limites de longueur. Le bouton
// 'Enregistrer' force un trim + max 50 chars name, 24 chars handle, 140 bio.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { getPrefs, updatePrefs } from "@/lib/prefs";

const AVATAR_PALETTE = [
  "📖", "🦉", "🖋", "🎩", "🌙", "☕", "🌿", "🐈‍⬛",
  "🪶", "🕯", "📜", "🍷", "🌒", "🗝", "🪩", "🥀",
];

type Props = {
  initialName: string;
  initialHandle: string;
  initialBio: string;
  initialAvatar: string;
  /** Appelé après save avec les nouvelles valeurs (pour update parent) */
  onSaved: (next: { name: string; handle: string; bio: string; avatar: string }) => void;
  onCancel: () => void;
};

export default function ProfileEditor({
  initialName,
  initialHandle,
  initialBio,
  initialAvatar,
  onSaved,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(initialHandle);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState(initialAvatar || "📖");

  const handleSave = () => {
    const cleanName = name.trim().slice(0, 50);
    // Handle : enlève @ initial si user en met un, garde [a-zA-Z0-9_-.]
    const cleanHandle = handle
      .trim()
      .replace(/^@+/, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "")
      .slice(0, 24);
    const cleanBio = bio.trim().slice(0, 140);

    updatePrefs({
      firstName: cleanName,
      handle: cleanHandle,
      bio: cleanBio,
      avatar,
    });
    onSaved({ name: cleanName, handle: cleanHandle, bio: cleanBio, avatar });
  };

  return (
    <div className="bg-paper border-2 border-ink/15 rounded-3xl p-5 space-y-4">
      <div>
        <label className="text-[10px] uppercase tracking-widest font-bold text-ink/50">
          Avatar
        </label>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {AVATAR_PALETTE.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              aria-label={`Choisir l'avatar ${a}`}
              className={`h-10 w-10 rounded-full text-xl flex items-center justify-center transition ${
                avatar === a
                  ? "bg-ink text-paper scale-110"
                  : "bg-ink/5 hover:bg-ink/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="profile-name"
          className="text-[10px] uppercase tracking-widest font-bold text-ink/50"
        >
          Prénom
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          placeholder="Ton prénom"
          className="mt-1 w-full px-3 py-2.5 bg-paper border border-ink/15 rounded-xl text-ink placeholder:text-ink/35 focus:outline-none focus:border-bordeaux"
        />
      </div>

      <div>
        <label
          htmlFor="profile-handle"
          className="text-[10px] uppercase tracking-widest font-bold text-ink/50"
        >
          Pseudo
        </label>
        <div className="mt-1 flex items-center gap-2 px-3 py-2.5 bg-paper border border-ink/15 rounded-xl focus-within:border-bordeaux">
          <span className="text-ink/40 font-mono text-sm">@</span>
          <input
            id="profile-handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            maxLength={24}
            placeholder="ton_pseudo"
            className="flex-1 bg-transparent text-ink placeholder:text-ink/35 focus:outline-none font-mono text-sm"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="profile-bio"
          className="text-[10px] uppercase tracking-widest font-bold text-ink/50"
        >
          Bio courte ({bio.length}/140)
        </label>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 140))}
          maxLength={140}
          rows={2}
          placeholder="Présente-toi en une phrase…"
          className="mt-1 w-full px-3 py-2.5 bg-paper border border-ink/15 rounded-xl text-ink placeholder:text-ink/35 focus:outline-none focus:border-bordeaux resize-none font-serif italic text-sm"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold text-ink/60 bg-ink/5 hover:bg-ink/10 transition"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 px-4 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold text-paper bg-ink hover:bg-bordeaux transition"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
