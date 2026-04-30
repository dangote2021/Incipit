"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import { BOOKS } from "@/lib/mock-data";
import type { Book } from "@/lib/types";

type Mode = "idle" | "processing" | "book-found" | "passage-found";

// ─── Scénarios OCR mockés (déterministes, basés sur le hash du fichier) ──
// On ne fait pas de vrai OCR : on simule un résultat plausible basé sur
// l'ordre d'appel, pour une démo propre.
const SCENARIOS: (
  | { kind: "book"; bookId: string; detectedLines: string[] }
  | { kind: "passage"; bookId?: string; excerpt: string; confidence: number }
)[] = [
  {
    kind: "book",
    bookId: "germinal",
    detectedLines: ["GERMINAL", "Émile Zola", "Folio classique"],
  },
  {
    kind: "passage",
    bookId: "etranger",
    excerpt:
      "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. J'ai reçu un télégramme de l'asile : « Mère décédée. Enterrement demain. Sentiments distingués. »",
    confidence: 0.94,
  },
  {
    kind: "book",
    bookId: "bovary",
    detectedLines: ["Madame Bovary", "Gustave Flaubert", "Édition illustrée"],
  },
  {
    kind: "passage",
    bookId: "pere-goriot",
    excerpt:
      "À nous deux maintenant ! — et pour premier acte du défi qu'il portait à la Société, Rastignac alla dîner chez Madame de Nucingen.",
    confidence: 0.87,
  },
  {
    kind: "passage",
    excerpt:
      "Il faut toujours un peu de nuit derrière les mots pour qu'ils se détachent du papier comme des étoiles.",
    confidence: 0.71,
  },
];

export default function ScanPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<(typeof SCENARIOS)[number] | null>(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [addedToLib, setAddedToLib] = useState(false);
  const [noted, setNoted] = useState(false);

  // Cleanup URL.createObjectURL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleTrigger = () => fileInputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    simulate();
    // reset input pour re-scanner la même image
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const simulate = () => {
    setAddedToLib(false);
    setNoted(false);
    setMode("processing");
    setProgress(0);
    const scenario = SCENARIOS[scenarioIdx % SCENARIOS.length];
    setScenarioIdx((i) => i + 1);

    // Progression factice en ~2.4s
    const steps = 40;
    const interval = 60;
    let s = 0;
    const timer = setInterval(() => {
      s++;
      setProgress(Math.round((s / steps) * 100));
      if (s >= steps) {
        clearInterval(timer);
        setResult(scenario);
        setMode(scenario.kind === "book" ? "book-found" : "passage-found");
      }
    }, interval);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setMode("idle");
    setProgress(0);
    setAddedToLib(false);
    setNoted(false);
  };

  const book: Book | undefined =
    result && "bookId" in result && result.bookId
      ? BOOKS.find((b) => b.id === result.bookId)
      : undefined;

  return (
    <>
      <AppHeader
        title="Scanner un livre"
        subtitle="Un livre dans les mains ? Pointe, on retrouve"
      />

      <main className="px-5 py-4 pb-10">
        {/* Input caché, capture caméra priorisée sur mobile */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />

        {mode === "idle" && (
          <IdleView onTrigger={handleTrigger} />
        )}

        {mode === "processing" && (
          <ProcessingView preview={preview} progress={progress} />
        )}

        {mode === "book-found" && result?.kind === "book" && book && (
          <BookFoundView
            book={book}
            detectedLines={result.detectedLines}
            preview={preview}
            addedToLib={addedToLib}
            onAddToLib={() => setAddedToLib(true)}
            onReset={reset}
            onReshoot={handleTrigger}
          />
        )}

        {mode === "passage-found" && result?.kind === "passage" && (
          <PassageFoundView
            book={book}
            excerpt={result.excerpt}
            confidence={result.confidence}
            preview={preview}
            noted={noted}
            onSaveNote={() => setNoted(true)}
            onReset={reset}
            onReshoot={handleTrigger}
          />
        )}
      </main>
    </>
  );
}

// ─── IDLE ──────────────────────────────────────────────────────────────────

function IdleView({ onTrigger }: { onTrigger: () => void }) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-ink via-bordeaux to-red-900 text-paper rounded-3xl p-7 mb-5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-9xl opacity-10">📷</div>
        <div className="relative">
          <div className="text-[10px] uppercase tracking-widest text-gold font-bold mb-2">
            OCR · Incipit Lens
          </div>
          <h2 className="font-serif text-3xl font-black leading-tight mb-3">
            Pointe ton livre,<br />
            on s'occupe du reste.
          </h2>
          <p className="text-sm text-paper/80 leading-relaxed">
            Une couverture → on retrouve le livre et son pitch.<br />
            Un passage → on l'extrait pour tes notes.
          </p>
        </div>
      </div>

      {/* CTA principal */}
      <button
        type="button"
        onClick={onTrigger}
        aria-label="Ouvrir l'appareil photo pour scanner un livre"
        className="w-full min-h-[44px] bg-bordeaux text-paper rounded-3xl p-8 flex flex-col items-center gap-3 shadow-xl hover:scale-[1.01] transition mb-5"
      >
        <div className="w-20 h-20 rounded-full bg-paper/15 flex items-center justify-center text-5xl" aria-hidden="true">
          📸
        </div>
        <div className="font-serif text-xl font-bold">
          Ouvrir l'appareil photo
        </div>
        <div className="text-xs uppercase tracking-widest text-paper/70">
          Couverture · passage · 4e de couverture
        </div>
      </button>

      {/* Galerie option */}
      <button
        type="button"
        onClick={onTrigger}
        aria-label="Choisir une image depuis la galerie"
        className="w-full min-h-[44px] bg-ink/5 text-ink rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-ink/10 transition mb-6"
      >
        <span className="text-xl" aria-hidden="true">🖼</span>
        <span className="text-xs uppercase tracking-widest font-bold">
          Choisir depuis la galerie
        </span>
      </button>

      {/* Modes d'usage */}
      <section className="space-y-3">
        <h3 className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
          Ce que tu peux scanner
        </h3>
        <Tip
          icon="📕"
          title="Une couverture"
          body="On reconnaît le livre, on ouvre sa fiche avec pitch, passages clés, personnages."
        />
        <Tip
          icon="📜"
          title="Un passage"
          body="On extrait le texte et on te propose de l'enregistrer comme annotation ou comme citation à partager."
        />
        <Tip
          icon="📝"
          title="Tes propres notes"
          body="Tu griffonnes en marge ? Photographie — on les transforme en notes numériques."
        />
      </section>

      {/* Disclaimer démo */}
      <div className="mt-6 bg-gold/10 border border-gold/30 rounded-2xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">
          Démo
        </div>
        <p className="text-xs text-ink/70 leading-relaxed">
          Version de prévisualisation : le scan simule une détection mais
          n'envoie aucune image à un serveur.
        </p>
      </div>
    </div>
  );
}

function Tip({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-paper border border-ink/10 rounded-2xl p-4 flex gap-3">
      <div className="text-3xl shrink-0">{icon}</div>
      <div>
        <div className="font-serif text-base font-bold text-ink">
          {title}
        </div>
        <p className="text-sm text-ink/70 leading-snug">{body}</p>
      </div>
    </div>
  );
}

// ─── PROCESSING ────────────────────────────────────────────────────────────

function ProcessingView({
  preview,
  progress,
}: {
  preview: string | null;
  progress: number;
}) {
  const steps = [
    { at: 15, label: "Analyse de l'image" },
    { at: 45, label: "Détection du texte" },
    { at: 75, label: "Comparaison à la base" },
    { at: 100, label: "Résultat prêt" },
  ];

  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden bg-ink aspect-[3/4] mb-5">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink to-bordeaux" />
        )}
        {/* Scan line animée */}
        <div
          className="absolute left-0 right-0 h-[3px] bg-gold shadow-[0_0_20px_4px_rgba(201,169,97,0.7)] transition-all duration-100"
          style={{ top: `${progress}%` }}
        />
        {/* Corners */}
        <Corner className="top-4 left-4 border-t-4 border-l-4" />
        <Corner className="top-4 right-4 border-t-4 border-r-4" />
        <Corner className="bottom-4 left-4 border-b-4 border-l-4" />
        <Corner className="bottom-4 right-4 border-b-4 border-r-4" />
      </div>

      {/* Progress */}
      <div className="bg-paper border border-ink/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
            Analyse en cours
          </div>
          <div className="text-sm font-bold text-ink">{progress}%</div>
        </div>
        <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-bordeaux transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ul className="space-y-2 text-sm">
          {steps.map((s, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 ${
                progress >= s.at ? "text-ink" : "text-ink/30"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  progress >= s.at
                    ? "bg-sage text-paper"
                    : "bg-ink/10 text-ink/30"
                }`}
              >
                {progress >= s.at ? "✓" : ""}
              </span>
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <div
      className={`absolute w-10 h-10 border-gold rounded ${className}`}
    />
  );
}

// ─── BOOK FOUND ────────────────────────────────────────────────────────────

function BookFoundView({
  book,
  detectedLines,
  preview,
  addedToLib,
  onAddToLib,
  onReset,
  onReshoot,
}: {
  book: Book;
  detectedLines: string[];
  preview: string | null;
  addedToLib: boolean;
  onAddToLib: () => void;
  onReset: () => void;
  onReshoot: () => void;
}) {
  return (
    <div>
      <div className="bg-sage/15 border border-sage/40 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sage text-paper flex items-center justify-center text-lg">
          ✓
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-sage font-bold">
            Livre reconnu
          </div>
          <div className="font-serif text-base font-bold text-ink">
            Une correspondance dans ta base Incipit
          </div>
        </div>
      </div>

      {/* Snapshot + détecté */}
      <div className="flex gap-4 mb-5">
        <div className="shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-ink/10">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Scan"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mb-1">
            Texte lu sur la couverture
          </div>
          <ul className="space-y-1">
            {detectedLines.map((l, i) => (
              <li
                key={i}
                className="font-mono text-xs text-ink/80 bg-ink/5 rounded px-2 py-1 truncate"
              >
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Carte livre */}
      <div
        className={`relative rounded-3xl p-6 bg-gradient-to-br ${book.cover} text-paper book-shadow mb-5`}
      >
        <div className="flex gap-4 items-center">
          <BookCover book={book} size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-paper/70 font-bold">
              Incipit confirme
            </div>
            <h3 className="font-serif text-2xl font-black leading-tight">
              {book.title}
            </h3>
            <div className="text-sm text-paper/80 mt-1">
              {book.author} · {book.year}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-paper/90 italic leading-relaxed">
          « {book.hook} »
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Link
          href={`/book/${book.id}`}
          className="w-full bg-ink text-paper py-4 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-bordeaux transition"
        >
          Ouvrir la fiche complète →
        </Link>
        <button
          type="button"
          onClick={onAddToLib}
          disabled={addedToLib}
          aria-label={addedToLib ? "Livre déjà ajouté à votre bibliothèque" : "Ajouter ce livre à votre bibliothèque"}
          className="w-full min-h-[44px] bg-sage/20 text-sage py-4 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-sage/30 transition disabled:opacity-60"
        >
          {addedToLib ? "✓ Ajouté à ta bibli" : "📚 Ajouter à ma bibli"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReshoot}
            aria-label="Refaire un scan"
            className="min-h-[44px] bg-ink/5 text-ink py-3 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-ink/10 transition"
          >
            ↻ Refaire un scan
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Retour à l'écran de scan"
            className="min-h-[44px] bg-ink/5 text-ink py-3 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-ink/10 transition"
          >
            ← Retour
          </button>
        </div>
      </div>

      <p className="text-[11px] text-ink/50 text-center mt-5 italic">
        Pas le bon livre ? Prends une photo plus nette, ou cherche manuellement.
      </p>
    </div>
  );
}

// ─── PASSAGE FOUND ─────────────────────────────────────────────────────────

function PassageFoundView({
  book,
  excerpt,
  confidence,
  preview,
  noted,
  onSaveNote,
  onReset,
  onReshoot,
}: {
  book?: Book;
  excerpt: string;
  confidence: number;
  preview: string | null;
  noted: boolean;
  onSaveNote: () => void;
  onReset: () => void;
  onReshoot: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const confidenceLabel =
    confidence >= 0.9
      ? "excellente"
      : confidence >= 0.8
      ? "bonne"
      : confidence >= 0.7
      ? "correcte"
      : "approximative";

  return (
    <div>
      <div className="bg-gold/15 border border-gold/40 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold text-paper flex items-center justify-center text-lg">
          ✎
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
            Passage extrait
          </div>
          <div className="font-serif text-base font-bold text-ink">
            Qualité de lecture {confidenceLabel} ({Math.round(confidence * 100)}%)
          </div>
        </div>
      </div>

      {/* Snapshot */}
      {preview && (
        <div className="rounded-xl overflow-hidden bg-ink/10 aspect-[16/10] mb-5 max-h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Scan"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Texte extrait */}
      <div className="bg-cream/60 border-l-4 border-bordeaux rounded-r-2xl px-5 py-4 mb-5">
        <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mb-2">
          Texte reconnu
        </div>
        <blockquote className="font-serif text-[17px] leading-relaxed italic text-ink">
          « {excerpt} »
        </blockquote>
        {book && (
          <div className="mt-3 text-xs text-ink/60">
            Correspondance trouvée :{" "}
            <span className="font-bold text-ink">{book.title}</span> —{" "}
            {book.author}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onSaveNote}
          disabled={noted}
          aria-label={noted ? "Annotation déjà enregistrée" : "Enregistrer comme annotation"}
          className="w-full min-h-[44px] bg-bordeaux text-paper py-4 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-red-800 transition disabled:opacity-60"
        >
          {noted ? "✓ Enregistré dans tes annotations" : "✎ Ajouter à mes annotations"}
        </button>

        {book && (
          <Link
            href={`/book/${book.id}`}
            className="w-full bg-ink/10 text-ink py-4 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-ink/20 transition"
          >
            📖 Voir le livre
          </Link>
        )}

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`« ${excerpt} »`);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2500);
            } catch {
              // Pas de clipboard API (vieux Safari, contexte non sécurisé) :
              // on ne peut pas vraiment copier, donc on ne ment pas.
              setCopied(false);
            }
          }}
          aria-label="Copier le passage dans le presse-papier"
          className="w-full min-h-[44px] bg-ink/5 text-ink py-3 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-ink/10 transition"
        >
          {copied ? "✓ Copié" : "📋 Copier le texte"}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReshoot}
            aria-label="Refaire un scan"
            className="min-h-[44px] bg-ink/5 text-ink py-3 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-ink/10 transition"
          >
            ↻ Refaire un scan
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Retour à l'écran de scan"
            className="min-h-[44px] bg-ink/5 text-ink py-3 rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-ink/10 transition"
          >
            ← Retour
          </button>
        </div>
      </div>

      <p className="text-[11px] text-ink/50 text-center mt-5 italic">
        Extrait court, usage privé — conforme à l'article L.122-5 CPI.
      </p>
    </div>
  );
}
