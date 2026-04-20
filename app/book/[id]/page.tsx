"use client";

import { notFound } from "next/navigation";
import { useState, use } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import VibeBadge from "@/components/VibeBadge";
import CharacterSheet from "@/components/CharacterSheet";
import {
  getBook,
  getNotesForBook,
  getUser,
  getLibraryEntry,
  getAnnotationsForBook,
  getRecosForBook,
  getBuddyForBook,
  getPassagesForBook,
  getCharactersForBook,
  LIBRAIRIES,
  RECAPS,
  MOODS,
  timeAgo,
  formatMinutes,
} from "@/lib/mock-data";
import type { ReadingStatus } from "@/lib/types";

const STATUS_OPTIONS: { key: ReadingStatus; label: string; emoji: string }[] = [
  { key: "to-read", label: "À lire", emoji: "📚" },
  { key: "reading", label: "En cours", emoji: "📖" },
  { key: "read", label: "Lu", emoji: "✓" },
];

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const book = getBook(id);
  if (!book) notFound();

  const entry = getLibraryEntry(id);
  const [status, setStatus] = useState<ReadingStatus | null>(
    entry?.status ?? null
  );
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [librairiesOpen, setLibrairiesOpen] = useState(false);
  const [charsOpen, setCharsOpen] = useState(false);
  const [showOpening, setShowOpening] = useState(false);

  const notes = getNotesForBook(id);
  const annotations = getAnnotationsForBook(id);
  const recos = getRecosForBook(id);
  const buddy = getBuddyForBook(id);
  const passages = getPassagesForBook(id);
  const characters = getCharactersForBook(id);
  const recap = RECAPS.find((r) => r.bookId === id);

  return (
    <>
      <AppHeader back subtitle="Fiche livre" />

      {/* Hero avec gradient du livre */}
      <section
        className={`relative bg-gradient-to-br ${book.cover} px-6 py-10 text-paper`}
      >
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative flex gap-5 items-start">
          <BookCover book={book} size="lg" />
          <div className="flex-1">
            <VibeBadge vibe={book.vibe} />
            <h1 className="mt-3 font-serif text-3xl font-black leading-[1.05] ink-drop">
              {book.title}
            </h1>
            <div className="text-paper/80 mt-1 font-medium">
              {book.author}
            </div>
            <div className="text-xs text-paper/70 mt-1 uppercase tracking-widest">
              {book.year} · {book.pages} p · {book.genre}
            </div>
          </div>
        </div>
      </section>

      <main className="px-5 py-6 space-y-8">
        {/* Mode "Je reprends" — affiché si on lit ce livre */}
        {entry?.status === "reading" && recap && (
          <section className="bg-gradient-to-br from-gold/20 to-cream border-2 border-gold/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⏮</span>
              <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                Je reprends ma lecture
              </div>
            </div>
            <div className="font-serif font-bold text-ink text-sm mb-2">
              Précédemment dans {book.title}… ({recap.upToChapter})
            </div>
            <p className="text-sm text-ink/80 leading-relaxed">
              {recap.summary}
            </p>
            {entry.progress !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-ink/60 font-bold mb-1">
                  <span>Progression</span>
                  <span>{entry.progress}%</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
                {entry.minutesRead && (
                  <div className="text-[11px] text-ink/50 mt-2">
                    {formatMinutes(entry.minutesRead)} de lecture cumulée
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Actions bibliothèque */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Ta bibliothèque
          </h2>
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
        </section>

        {/* Pitch */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Le pitch
          </h2>
          <p className="text-xl font-serif italic text-ink leading-snug mb-4">
            « {book.hook} »
          </p>
          <p className="text-[15px] leading-relaxed text-ink/85">{book.pitch}</p>
        </section>

        {/* Incipit — premières lignes */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            L'incipit
          </h2>
          <button
            onClick={() => setShowOpening((v) => !v)}
            className="w-full text-left bg-cream/70 border border-dust rounded-2xl p-5 hover:border-ink/25 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
                Ouvre le livre
              </span>
              <span className="text-ink/40">{showOpening ? "▲" : "▼"}</span>
            </div>
            {showOpening ? (
              <p className="font-serif text-base text-ink/90 leading-relaxed italic">
                {book.openingLines}
              </p>
            ) : (
              <p className="font-serif text-sm text-ink/60 leading-relaxed italic line-clamp-2">
                {book.openingLines.slice(0, 120)}…
              </p>
            )}
          </button>
        </section>

        {/* Passages clés */}
        {passages.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
                Passages clés · {passages.length}
              </h2>
              <Link
                href="/explore"
                className="text-xs font-bold uppercase tracking-widest text-bordeaux"
              >
                Tous →
              </Link>
            </div>
            <p className="text-xs text-ink/60 mb-4 leading-relaxed">
              Du vrai texte, choisi avec soin. On te dit pourquoi chaque
              passage compte.
            </p>
            <ol className="space-y-3">
              {passages.slice(0, 3).map((p) => (
                <li
                  key={p.id}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-serif text-2xl text-bordeaux/40 font-bold leading-none">
                      0{p.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[15px] font-bold text-ink leading-tight">
                        {p.title}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold mt-0.5">
                        {p.chapter} · {p.readingMinutes} min
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink/70 leading-relaxed mb-3">
                    {p.context}
                  </p>
                  <blockquote className="border-l-2 border-bordeaux/60 pl-3 font-serif text-[14px] text-ink/90 italic leading-relaxed">
                    {p.excerpt}
                  </blockquote>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Thèmes + Moods */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Parcours
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {book.moods.map((m) => {
              const meta = MOODS.find((x) => x.key === m);
              if (!meta) return null;
              return (
                <Link
                  key={m}
                  href="/explore"
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-bordeaux/10 text-bordeaux border border-bordeaux/20 hover:bg-bordeaux/15 transition"
                >
                  {meta.emoji} {meta.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {book.themes.map((t) => (
              <span
                key={t}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-ink/5 text-ink/80 border border-ink/10"
              >
                #{t}
              </span>
            ))}
          </div>
        </section>

        {/* Reading buddy */}
        {buddy && (
          <section className="bg-sage/10 border border-sage/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">👯</span>
              <div className="text-[10px] uppercase tracking-widest text-sage font-bold">
                Reading buddy en cours
              </div>
            </div>
            <div className="font-serif font-bold text-ink mb-3">
              {buddy.participants.length} lecteurs avancent ensemble sur ce
              livre.
            </div>
            <div className="flex -space-x-2 mb-3">
              {buddy.participants.map((p) => {
                const u = getUser(p.userId);
                if (!u) return null;
                return (
                  <div
                    key={p.userId}
                    title={`${u.name} · ${p.progress}%`}
                    className="w-9 h-9 rounded-full bg-paper border-2 border-sage flex items-center justify-center text-lg"
                  >
                    {u.avatar}
                  </div>
                );
              })}
            </div>
            <Link
              href={`/buddy/${book.id}`}
              className="inline-block bg-sage text-paper text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full hover:bg-sage/90 transition"
            >
              Rejoindre la lecture partagée →
            </Link>
          </section>
        )}

        {/* Actions — compagnon IA + libraires + personnages + lecture */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Pour t'accompagner
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAiOpen(true)}
              className="bg-ink text-paper rounded-2xl p-4 text-left hover:bg-ink/90 transition"
            >
              <div className="text-xl mb-1">🧠</div>
              <div className="font-serif font-bold text-base leading-tight">
                Compagnon
              </div>
              <div className="text-[11px] text-paper/70 mt-0.5">
                Pose une question
              </div>
            </button>
            {characters.length > 0 && (
              <button
                onClick={() => setCharsOpen(true)}
                className="bg-sage text-paper rounded-2xl p-4 text-left hover:bg-sage/90 transition"
              >
                <div className="text-xl mb-1">🎭</div>
                <div className="font-serif font-bold text-base leading-tight">
                  Personnages
                </div>
                <div className="text-[11px] text-paper/70 mt-0.5">
                  {characters.length} fiches
                </div>
              </button>
            )}
            {passages.length > 0 && (
              <Link
                href={`/book/${book.id}/read`}
                className="bg-gold text-ink rounded-2xl p-4 text-left hover:bg-gold/90 transition"
              >
                <div className="text-xl mb-1">📖</div>
                <div className="font-serif font-bold text-base leading-tight">
                  Mode lecture
                </div>
                <div className="text-[11px] text-ink/70 mt-0.5">
                  {passages.length} passage{passages.length > 1 ? "s" : ""} clé
                  {passages.length > 1 ? "s" : ""}
                </div>
              </Link>
            )}
            <button
              onClick={() => setLibrairiesOpen(true)}
              className="bg-bordeaux text-paper rounded-2xl p-4 text-left hover:bg-bordeaux/90 transition"
            >
              <div className="text-xl mb-1">🏛️</div>
              <div className="font-serif font-bold text-base leading-tight">
                Chez ton libraire
              </div>
              <div className="text-[11px] text-paper/70 mt-0.5">
                Indé, pas Amazon
              </div>
            </button>
          </div>
        </section>

        {/* Annotations publiques */}
        {annotations.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Ce que les lecteurs soulignent · {annotations.length}
            </h2>
            <ul className="space-y-3">
              {annotations.map((a) => {
                const u = getUser(a.userId);
                return (
                  <li
                    key={a.id}
                    className="bg-cream/50 border border-dust rounded-2xl p-4"
                  >
                    <div className="font-serif italic text-ink/90 text-[15px] leading-snug border-l-2 border-bordeaux pl-3 mb-3">
                      « {a.excerpt} »
                    </div>
                    {a.note && (
                      <p className="text-sm text-ink/75 leading-relaxed mb-2">
                        {a.note}
                      </p>
                    )}
                    {u && (
                      <div className="text-[11px] text-ink/50">
                        surligné par <span className="font-bold">{u.name}</span>{" "}
                        · {timeAgo(a.createdAt)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Recommandations */}
        {recos.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Si tu aimes ça, tente…
            </h2>
            <ul className="space-y-3">
              {recos.slice(0, 3).map((r) => {
                const target = getBook(r.targetBookId);
                if (!target) return null;
                return (
                  <li key={r.targetBookId}>
                    <Link
                      href={`/book/${target.id}`}
                      className="flex gap-3 items-start bg-paper border border-ink/10 rounded-2xl p-3 hover:border-ink/25 transition"
                    >
                      <BookCover book={target} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-base font-bold text-ink leading-tight">
                          {target.title}
                        </div>
                        <div className="text-[11px] text-ink/60 mb-1">
                          {target.author} · {target.year}
                        </div>
                        <div className="text-xs text-ink/75 italic leading-snug">
                          {r.reason}
                        </div>
                      </div>
                      <span className="text-ink/40 mt-1">›</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Notes de lecture */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
              Notes de lecture · {notes.length}
            </h2>
            <button
              onClick={() => setWriting(true)}
              className="text-xs font-bold uppercase tracking-widest text-bordeaux"
            >
              + Écrire
            </button>
          </div>

          {writing && (
            <div className="mb-4 bg-cream border border-ink/10 rounded-2xl p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ta lecture, ta pensée, ta claque, ton désaccord…"
                rows={5}
                className="w-full bg-transparent text-ink placeholder:text-ink/40 font-serif resize-none focus:outline-none"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setWriting(false);
                    setDraft("");
                  }}
                  className="text-xs uppercase tracking-widest text-ink/60 font-semibold px-3 py-1.5"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setWriting(false);
                    setDraft("");
                  }}
                  className="text-xs uppercase tracking-widest font-bold bg-ink text-paper px-4 py-2 rounded-full"
                >
                  Publier
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-3">
            {notes.map((n) => {
              const user = getUser(n.userId)!;
              return (
                <li
                  key={n.id}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{user.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-ink/50">
                        {user.handle} · {timeAgo(n.createdAt)}
                      </div>
                    </div>
                    {n.rating && (
                      <span className="text-gold text-sm">
                        {"★".repeat(n.rating)}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-[15px] text-ink/90 leading-relaxed">
                    {n.text}
                  </p>
                </li>
              );
            })}
            {notes.length === 0 && (
              <li className="text-center text-ink/50 py-6 text-sm">
                Sois le premier à écrire une note sur ce livre.
              </li>
            )}
          </ul>
        </section>

        <div className="pt-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold text-ink/50"
          >
            ← Retour au feed
          </Link>
        </div>
      </main>

      {/* Modal : Compagnon IA */}
      {aiOpen && (
        <Modal onClose={() => setAiOpen(false)} title="Compagnon de lecture">
          <p className="text-sm text-ink/75 leading-relaxed mb-4">
            Pose une question sur {book.title} — un personnage, un contexte
            historique, un passage que tu n'as pas compris. Le compagnon répond
            sans te spoiler plus que ta progression.
          </p>
          <div className="space-y-2 mb-4">
            <Suggestion text={`Qui est vraiment ${book.author} ?`} />
            <Suggestion text="Que se passe-t-il au chapitre précédent ?" />
            <Suggestion text="C'est quoi le contexte historique ?" />
            <Suggestion text="Explique-moi cette phrase…" />
          </div>
          <div className="bg-cream border border-ink/10 rounded-xl p-3">
            <input
              placeholder="Ta question…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>
          <div className="text-[11px] text-ink/50 mt-3 italic">
            Bêta — les réponses sont relues par un humain avant publication.
          </div>
        </Modal>
      )}

      {/* Drawer : Personnages */}
      <CharacterSheet
        characters={characters}
        open={charsOpen}
        onClose={() => setCharsOpen(false)}
      />

      {/* Modal : Libraires */}
      {librairiesOpen && (
        <Modal
          onClose={() => setLibrairiesOpen(false)}
          title="Chez ton libraire"
        >
          {/* Bannière Placedeslibraires.fr */}
          <a
            href={`https://www.placedeslibraires.fr/listeliv.php?mots_recherche=${encodeURIComponent(
              `${book.title} ${book.author}`
            )}&form_recherche_avancee=ok`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-ink via-bordeaux to-red-900 text-paper rounded-2xl p-5 mb-5 hover:scale-[1.01] transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">📍</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  Priorité · librairies indépendantes
                </div>
                <h4 className="font-serif text-lg font-black leading-tight mt-1">
                  Placedeslibraires.fr
                </h4>
                <p className="text-xs text-paper/80 leading-relaxed mt-1">
                  2 800 libraires indépendantes en France.
                  Dispo en stock, retrait 2h, livraison rapide.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-paper/15 border border-paper/25 rounded-full px-3 py-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    Trouver en librairie
                  </span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </a>

          <p className="text-xs text-ink/70 leading-relaxed mb-4 italic">
            Chez Incipit, on redirige vers le réseau des libraires indés avant
            tout le reste. Aucun partenariat avec Amazon.
          </p>

          {/* Librairies mockées à proximité */}
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold mb-2">
              Repérées près de chez toi
            </div>
            <ul className="space-y-2">
              {LIBRAIRIES.map((l) => (
                <li
                  key={l.name}
                  className="flex items-center justify-between bg-cream border border-ink/10 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-ink truncate">
                      {l.name}
                    </div>
                    <div className="text-[11px] text-ink/60">
                      {l.city} · {l.distanceKm.toFixed(1)} km
                    </div>
                  </div>
                  <a
                    href={`https://www.placedeslibraires.fr/listeliv.php?mots_recherche=${encodeURIComponent(
                      `${book.title} ${book.author}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest font-bold text-bordeaux shrink-0 ml-3"
                  >
                    Voir stock →
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Autres options — en sourdine, pas d'Amazon */}
          <details className="mt-4">
            <summary className="text-[10px] uppercase tracking-widest text-ink/50 font-bold cursor-pointer hover:text-ink/70 transition">
              Autres plateformes
            </summary>
            <ul className="mt-3 space-y-2">
              {[
                {
                  name: "Lalibrairie.com",
                  note: "Réseau coop de libraires indépendants",
                  url: `https://www.lalibrairie.com/recherche/?q=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
                {
                  name: "Leslibraires.fr",
                  note: "Plateforme de plus de 400 librairies",
                  url: `https://www.leslibraires.fr/recherche/?q=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
                {
                  name: "Librairie Mollat",
                  note: "La plus grande indé de France",
                  url: `https://www.mollat.com/recherche?query=${encodeURIComponent(
                    book.title + " " + book.author
                  )}`,
                },
              ].map((opt) => (
                <li key={opt.name}>
                  <a
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-ink/5 rounded-xl p-3 hover:bg-ink/10 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-sm font-bold text-ink">
                        {opt.name}
                      </div>
                      <div className="text-[11px] text-ink/60 truncate">
                        {opt.note}
                      </div>
                    </div>
                    <span className="text-ink/40 shrink-0">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className="mt-5 bg-sage/10 border border-sage/30 rounded-xl p-3 text-[11px] text-ink/70 leading-relaxed">
            <span className="font-bold text-sage">Bon à savoir : </span>
            acheter en librairie indépendante, c'est soutenir 15 000 emplois
            non-délocalisables et un maillage culturel fin dans toute la France.
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink/50 text-xl font-bold px-2"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <button className="w-full text-left text-sm bg-ink/5 hover:bg-ink/10 text-ink/80 px-3 py-2 rounded-xl transition">
      {text}
    </button>
  );
}
