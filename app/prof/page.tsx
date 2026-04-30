"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /prof — Mode prof (#47).
//
// Page sobre, sans bottom nav, optimisée pour : (1) être trouvée par les
// profs (route claire, contenu pédagogique), (2) générer un quiz imprimable
// en 2 clics, (3) répondre à la question "j'ai le droit de l'utiliser en
// classe ?" avec une licence CC explicite.
//
// On ne génère PAS de PDF côté serveur (pas de dépendance puppeteer / pdfkit
// pour 5% des cas d'usage). À la place, une page imprimable au format A4
// avec print CSS — le prof fait Cmd/Ctrl+P → "Enregistrer en PDF". Format
// 100% browser, taille du fichier maîtrisée par l'utilisateur.
//
// Licence : Creative Commons BY-NC 4.0 sur les fiches générées. Les œuvres
// sources restent dans leur régime de droits propre (domaine public pour la
// majorité des classiques cités). Voir /legal pour le détail.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LIT_QUESTIONS,
  CATEGORY_LABELS,
  ERA_LABELS,
  type LitCategory,
  type LitEra,
  type LitQuestion,
} from "@/lib/quiz-literature";
import { track } from "@/lib/telemetry";

const ALL_CATEGORIES: LitCategory[] = [
  "opening",
  "author",
  "character",
  "date",
  "movement",
  "device",
];
const ALL_ERAS: LitEra[] = ["avant-1800", "XIXe", "XXe", "XXIe"];

export default function ProfPage() {
  const [categories, setCategories] = useState<Set<LitCategory>>(
    new Set(ALL_CATEGORIES)
  );
  const [eras, setEras] = useState<Set<LitEra>>(new Set(ALL_ERAS));
  const [count, setCount] = useState<number>(10);
  const [showAnswers, setShowAnswers] = useState(true);
  const [title, setTitle] = useState("Quiz littéraire");
  const [className, setClassName] = useState("");
  const [printMode, setPrintMode] = useState(false);

  // Filtre les questions selon les choix. Si le filtre est trop restrictif,
  // on tombe sur < count : c'est ok, on imprime ce qu'on a.
  const filtered = useMemo<LitQuestion[]>(() => {
    return LIT_QUESTIONS.filter(
      (q) => categories.has(q.category) && eras.has(q.era)
    );
  }, [categories, eras]);

  // Tirage déterministe (basé sur l'index) pour que deux profs avec les
  // mêmes filtres aient le même quiz — utile en réseau d'établissements.
  const selected = useMemo(() => filtered.slice(0, count), [filtered, count]);

  const toggleCat = (c: LitCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      // Garde-fou : on ne laisse pas tout vider, sinon le quiz est vide.
      if (next.size === 0) next.add(c);
      return next;
    });
  };
  const toggleEra = (e: LitEra) => {
    setEras((prev) => {
      const next = new Set(prev);
      next.has(e) ? next.delete(e) : next.add(e);
      if (next.size === 0) next.add(e);
      return next;
    });
  };

  const handlePrint = () => {
    setPrintMode(true);
    track("prof_quiz_printed", {
      count: selected.length,
      categories: Array.from(categories).sort().join(","),
      eras: Array.from(eras).sort().join(","),
      with_answers: showAnswers,
    });
    // Laisse React render l'écran print, puis lance le dialogue.
    setTimeout(() => {
      window.print();
      // Repasser en mode normal après l'impression (l'event afterprint
      // est plus propre que setTimeout, mais setTimeout est universel).
      setTimeout(() => setPrintMode(false), 500);
    }, 50);
  };

  if (printMode) {
    return (
      <PrintableQuiz
        title={title}
        className={className}
        questions={selected}
        showAnswers={showAnswers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header sobre — pas de BottomNav sur cette page : on ne veut pas
          distraire un prof de son outil. */}
      <header className="border-b border-ink/10 bg-paper sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-ink/60 text-xs uppercase tracking-widest font-bold hover:text-ink transition"
          >
            ← Incipit
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold">
            Mode prof
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero pédagogique */}
        <section className="mb-10">
          <h1 className="font-serif text-4xl font-black text-ink leading-tight">
            Un quiz littéraire prêt en 2 minutes,<br />
            imprimable et libre de réutilisation.
          </h1>
          <p className="mt-4 text-ink/70 text-base leading-relaxed">
            Pour les enseignants de français, collège et lycée. Choisis tes
            catégories, ton époque, le nombre de questions — et imprime. Une
            feuille pour les élèves, une feuille corrigée pour toi.
          </p>
          <p className="mt-3 text-sm text-ink/60 leading-relaxed">
            Les fiches générées sont distribuées sous licence{" "}
            <strong className="text-ink">Creative Commons BY-NC 4.0</strong>{" "}
            — tu peux les diffuser, les adapter, les imprimer pour ta classe.
            Mention : « via Incipit ».
          </p>
        </section>

        {/* Builder */}
        <section className="bg-cream/50 border-2 border-ink/10 rounded-3xl p-6 mb-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-4">
            1. Personnalise
          </h2>

          <div className="space-y-5">
            {/* Titre + classe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-1.5">
                  Titre du quiz
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  className="w-full px-3 py-2.5 bg-paper border-2 border-ink/15 rounded-xl text-sm text-ink focus:border-bordeaux focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-1.5">
                  Classe (optionnel)
                </span>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ex. 1ʳᵉ B"
                  maxLength={40}
                  className="w-full px-3 py-2.5 bg-paper border-2 border-ink/15 rounded-xl text-sm text-ink focus:border-bordeaux focus:outline-none"
                />
              </label>
            </div>

            {/* Catégories */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-2">
                Catégories ({categories.size}/{ALL_CATEGORIES.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((c) => {
                  const active = categories.has(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCat(c)}
                      className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition border-2 ${
                        active
                          ? "bg-ink text-paper border-ink"
                          : "bg-paper text-ink/60 border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <span className="mr-1.5">{CATEGORY_LABELS[c].emoji}</span>
                      {CATEGORY_LABELS[c].title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Époques */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-2">
                Époques ({eras.size}/{ALL_ERAS.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_ERAS.map((e) => {
                  const active = eras.has(e);
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleEra(e)}
                      className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition border-2 ${
                        active
                          ? "bg-bordeaux text-paper border-bordeaux"
                          : "bg-paper text-ink/60 border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      {ERA_LABELS[e]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nombre de questions */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-2">
                Nombre de questions ({count} max — {filtered.length} dispo)
              </span>
              <input
                type="range"
                min={3}
                max={Math.min(20, filtered.length)}
                step={1}
                value={Math.min(count, filtered.length)}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
                className="w-full accent-bordeaux"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-ink/40 mt-1">
                <span>3</span>
                <span>{Math.min(20, filtered.length)}</span>
              </div>
            </div>

            {/* Toggle answer key */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
                className="w-4 h-4 accent-bordeaux"
              />
              <span className="text-sm text-ink">
                Inclure la fiche de correction (page séparée)
              </span>
            </label>
          </div>
        </section>

        {/* Aperçu / impression */}
        <section className="mb-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-3">
            2. Imprime
          </h2>
          <p className="text-sm text-ink/60 mb-4">
            L&apos;aperçu d&apos;impression de ton navigateur (Cmd/Ctrl + P)
            te permet d&apos;ajuster la mise en page avant d&apos;imprimer ou
            d&apos;enregistrer en PDF.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            disabled={selected.length < 3}
            className="w-full bg-ink text-paper py-4 rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-bordeaux transition"
          >
            Imprimer le quiz ({selected.length} questions)
          </button>
        </section>

        {/* Aperçu sommaire des questions tirées */}
        <section className="bg-paper border border-ink/10 rounded-2xl p-5 mb-10">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-bold mb-3">
            Aperçu — {selected.length} question{selected.length > 1 ? "s" : ""}
          </h3>
          <ol className="space-y-2 list-decimal pl-5">
            {selected.map((q) => (
              <li key={q.id} className="text-sm text-ink/80 leading-snug">
                <span className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mr-2">
                  {CATEGORY_LABELS[q.category].title}
                </span>
                {q.prompt}
              </li>
            ))}
          </ol>
        </section>

        {/* Fiche "utiliser en classe" */}
        <section className="bg-cream/40 border-l-4 border-bordeaux px-5 py-5 rounded-r-2xl mb-10">
          <h2 className="font-serif text-xl font-bold text-ink mb-3">
            Utiliser en classe — fiche pratique
          </h2>
          <ul className="space-y-2 text-sm text-ink/80 leading-relaxed list-disc pl-5">
            <li>
              <strong>Format conseillé.</strong> 10 questions en 15 minutes,
              en début ou fin de séquence. Compter 1 minute par question
              (incluant la lecture du choix multiple) + 5 minutes de
              correction collective.
            </li>
            <li>
              <strong>Variante orale.</strong> Projeter une question, laisser
              30 secondes de réflexion, choisir une main qui ne s&apos;est
              pas encore exprimée. Bonus : demander pourquoi avant la
              validation.
            </li>
            <li>
              <strong>Pour différencier.</strong> La fiche imprime aussi les
              distracteurs : les élèves les plus avancés peuvent justifier
              pourquoi les trois autres options sont fausses.
            </li>
            <li>
              <strong>Évaluation diagnostique.</strong> Sans correction
              affichée, le quiz fonctionne comme un état des lieux culturel
              en début d&apos;année — pas de note, juste un point de
              référence.
            </li>
            <li>
              <strong>Au-delà du quiz.</strong> Chaque livre cité a une fiche
              dédiée sur Incipit avec contexte historique, biographie et
              recommandations — utile pour préparer un cours complémentaire.
            </li>
          </ul>
        </section>

        {/* Licence */}
        <section className="text-xs text-ink/60 leading-relaxed border-t border-ink/10 pt-6">
          <p className="mb-2">
            <strong className="text-ink">Licence</strong> — Les fiches
            générées ici sont mises à disposition selon les termes de la{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-bordeaux"
            >
              licence Creative Commons Attribution — Pas d&apos;Utilisation
              Commerciale 4.0 International
            </a>
            . Tu peux les utiliser, les modifier et les distribuer en classe
            ou en formation, à condition de citer « via Incipit » et de ne
            pas les revendre.
          </p>
          <p>
            Les œuvres sources restent dans leur propre régime de droits.
            Pour les classiques cités (Camus, Flaubert, Zola, etc.),
            consulter <Link href="/legal" className="underline hover:text-bordeaux">/legal</Link> — la
            plupart sont dans le domaine public en France.
          </p>
        </section>
      </main>
    </div>
  );
}

// ─── Page imprimable — A4 avec print CSS ───────────────────────────────────
function PrintableQuiz({
  title,
  className,
  questions,
  showAnswers,
}: {
  title: string;
  className: string;
  questions: LitQuestion[];
  showAnswers: boolean;
}) {
  // Mélange déterministe des options (answer + distractors) — on ne veut pas
  // que la bonne réponse soit toujours en première position.
  const buildOptions = (q: LitQuestion): string[] => {
    const all = [q.answer, ...q.distractors];
    // Tri stable mais pseudo-aléatoire basé sur l'id : reproductible.
    return all.sort((a, b) => {
      const ha = hash(q.id + a);
      const hb = hash(q.id + b);
      return ha - hb;
    });
  };

  return (
    <div className="bg-white text-black font-serif print-page">
      {/* Print CSS — masque tout le reste, force A4, marges propres. */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 18mm 16mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        .print-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 24px;
          color: #111;
          background: white;
        }
        .print-page h1 {
          font-family: Georgia, "Playfair Display", serif;
          font-size: 28px;
          font-weight: 900;
          margin: 0 0 4px;
        }
        .print-page .quiz-meta {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 28px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ccc;
        }
        .print-page ol.questions {
          padding-left: 24px;
          margin: 0;
        }
        .print-page ol.questions > li {
          margin-bottom: 18px;
          break-inside: avoid;
        }
        .print-page .q-prompt {
          font-size: 15px;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .print-page .q-options {
          list-style: none;
          padding-left: 0;
          font-size: 14px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .print-page .q-options li {
          margin-bottom: 4px;
          padding-left: 22px;
          position: relative;
        }
        .print-page .q-options li::before {
          content: "☐";
          position: absolute;
          left: 0;
          font-size: 14px;
        }
        .print-page .q-cat {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8a1234;
          font-weight: bold;
          font-family: Arial, sans-serif;
          margin-right: 6px;
        }
        .print-page .answer-page {
          page-break-before: always;
        }
        .print-page .answer-key {
          font-family: Arial, sans-serif;
        }
        .print-page .answer-key li {
          margin-bottom: 14px;
          break-inside: avoid;
          font-size: 13px;
        }
        .print-page .answer-key .a-explain {
          color: #444;
          font-style: italic;
          font-size: 12px;
          margin-top: 4px;
        }
        .print-page .footer-cc {
          margin-top: 32px;
          padding-top: 12px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #666;
          font-family: Arial, sans-serif;
        }
        @media screen {
          .print-page {
            min-height: 100vh;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
            margin: 24px auto;
          }
        }
      `}</style>

      <h1>{title}</h1>
      <div className="quiz-meta">
        {className && <>Classe : {className} · </>}
        Date : ___ / ___ / 20___ · Nom : __________________________
      </div>

      <ol className="questions">
        {questions.map((q) => {
          const opts = buildOptions(q);
          return (
            <li key={q.id}>
              <div className="q-prompt">
                <span className="q-cat">{CATEGORY_LABELS[q.category].title}</span>
                {q.prompt}
              </div>
              <ul className="q-options">
                {opts.map((opt) => (
                  <li key={opt}>{opt}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      <div className="footer-cc">
        Quiz généré sur Incipit · CC BY-NC 4.0 · incipit.app
      </div>

      {showAnswers && (
        <div className="answer-page">
          <h1>Corrigé — {title}</h1>
          <div className="quiz-meta">
            Réservé à l&apos;enseignant · {questions.length} questions
          </div>
          <ol className="answer-key">
            {questions.map((q) => (
              <li key={q.id}>
                <strong>{q.prompt}</strong>
                <br />
                Réponse : <strong>{q.answer}</strong>
                {q.explanation && (
                  <div className="a-explain">{q.explanation}</div>
                )}
              </li>
            ))}
          </ol>
          <div className="footer-cc">
            Corrigé · CC BY-NC 4.0 · via Incipit · incipit.app
          </div>
        </div>
      )}
    </div>
  );
}

// Petit hash pour mélanger les options de manière reproductible.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
