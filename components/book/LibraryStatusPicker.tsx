"use client";

import { useState } from "react";
import type { ReadingStatus } from "@/lib/types";

const STATUS_OPTIONS: { key: ReadingStatus; label: string; emoji: string }[] = [
  { key: "to-read", label: "À lire", emoji: "📚" },
  { key: "reading", label: "En cours", emoji: "📖" },
  { key: "read", label: "Lu", emoji: "✓" },
];

type Props = {
  initialStatus?: ReadingStatus | null;
};

// Ilot client minimal : seul le picker de statut a besoin de useState.
// Le reste de la fiche livre est rendu côté serveur pour le SEO.
export default function LibraryStatusPicker({ initialStatus = null }: Props) {
  const [status, setStatus] = useState<ReadingStatus | null>(initialStatus);

  return (
    <div className="grid grid-cols-3 gap-2">
      {STATUS_OPTIONS.map((o) => (
        <button
          key={o.key}
          onClick={() => setStatus(o.key)}
          className={`flex flex-col items-center py-3 rounded-2xl border-2 transition ${
            status === o.key
              ? "border-bordeaux bg-bordeaux text-paper shadow"
              : "border-ink/10 bg-paper text-ink hover:border-ink/30"
          }`}
        >
          <span className="text-xl mb-1">{o.emoji}</span>
          <span className="text-[11px] uppercase tracking-widest font-bold">
            {o.label}
          </span>
        </button>
      ))}
    </div>
  );
}
