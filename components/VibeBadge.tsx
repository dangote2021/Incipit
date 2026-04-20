import type { Book } from "@/lib/types";

const VIBE_LABELS: Record<Book["vibe"], { label: string; className: string }> = {
  dark: { label: "Sombre", className: "bg-ink text-paper" },
  romantic: { label: "Romance / Drame", className: "bg-rose-100 text-rose-900" },
  political: { label: "Politique", className: "bg-bordeaux text-paper" },
  absurd: { label: "Absurde", className: "bg-amber-100 text-amber-900" },
  epic: { label: "Épique", className: "bg-amber-700 text-paper" },
  wild: { label: "Dévorant", className: "bg-orange-500 text-white" },
  mystique: { label: "Mystique", className: "bg-indigo-200 text-indigo-900" },
};

export default function VibeBadge({ vibe }: { vibe: Book["vibe"] }) {
  const v = VIBE_LABELS[vibe];
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full ${v.className}`}>
      {v.label}
    </span>
  );
}
