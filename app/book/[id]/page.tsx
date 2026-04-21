import { notFound } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BookCover from "@/components/BookCover";
import VibeBadge from "@/components/VibeBadge";
import ReadElsewhere from "@/components/ReadElsewhere";
import LibraryStatusPicker from "@/components/book/LibraryStatusPicker";
import OpeningLinesReveal from "@/components/book/OpeningLinesReveal";
import NoteComposer from "@/components/book/NoteComposer";
import BookActionPanel from "@/components/book/BookActionPanel";
import LibrairesByPostalCode from "@/components/book/LibrairesByPostalCode";
import MarkAsReadButton from "@/components/book/MarkAsReadButton";
import PassagesList from "@/components/book/PassagesList";
import {
  BOOKS,
  getBook,
  getNotesForBook,
  getUser,
  getLibraryEntry,
  getAnnotationsForBook,
  getRecosForBook,
  getBuddyForBook,
  getPassagesForBook,
  getCharactersForBook,
  RECAPS,
  MOODS,
  timeAgo,
  formatMinutes,
} from "@/lib/mock-data";

// ISR : les 12 fiches classiques sont pré-générées au build. Le HTML est
// servi statiquement, les crawlers n'ont plus à exécuter de JS pour voir le
// contenu — résout les remontées beta de Camille et Mehdi ("page vide côté
// crawler, SEO naze pour un produit édito qui vit d'organique").
export function generateStaticParams() {
  return BOOKS.map((b) => ({ id: b.id }));
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  const entry = getLibraryEntry(id);
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

      {/* Hero — rendu côté serveur, présent dès le premier paint */}
      <section
        className={`relative bg-gradient-to-br ${book.cover} px-6 py-10 text-paper`}
      >
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative flex gap-5 items-start">
          <BookCover book={book} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <VibeBadge vibe={book.vibe} />
              {book.tier && (
                <span
                  className={`inline-flex items-center text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-full border ${
                    book.tier === "chef-oeuvre"
                      ? "bg-gold/90 text-ink border-gold"
                      : book.tier === "classique"
                        ? "bg-paper/20 text-paper border-paper/40"
                        : "bg-paper/10 text-paper/90 border-paper/30"
                  }`}
                  title={
                    book.tier === "chef-oeuvre"
                      ? "Œuvre cardinale du canon"
                      : book.tier === "classique"
                        ? "Œuvre majeure du canon"
                        : "Incontournable"
                  }
                >
                  {book.tier === "chef-oeuvre"
                    ? "Chef-d'œuvre"
                    : book.tier === "classique"
                      ? "Classique"
                      : "Incontournable"}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-serif text-3xl font-black leading-[1.05] ink-drop">
              {book.title}
            </h1>
            {book.fullTitle && book.fullTitle !== book.title && (
              <div className="text-paper/75 text-sm font-serif italic mt-1 leading-snug">
                {book.fullTitle}
              </div>
            )}
            <div className="text-paper/85 mt-1 font-medium">
              {book.author}
              {book.translator ? (
                <span className="text-paper/70 text-sm">
                  {" "}
                  · trad. {book.translator}
                  {book.translationYear ? ` (${book.translationYear})` : ""}
                </span>
              ) : null}
            </div>
            <div className="text-xs text-paper/70 mt-1 uppercase tracking-widest">
              {book.year} · {book.pages} p · {book.genre}
            </div>
            {book.publicDomain && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-gold/90 text-ink text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-full">
                ★ Domaine public · lecture gratuite
              </div>
            )}
            {/* "J'ai lu ce livre" — déclenche le parcours de lecture
                (cf. components/NextSuggestion.tsx). Placé dans le Hero
                pour être immédiatement saisissable à l'arrivée sur la
                fiche — retour panel v8, Mehdi. */}
            <MarkAsReadButton bookId={book.id} />
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

        {/* Actions bibliothèque — picker de statut, ilot client */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Ta bibliothèque
          </h2>
          <LibraryStatusPicker initialStatus={entry?.status ?? null} />
        </section>

        {/* Pitch — SSR */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Le pitch
          </h2>
          <p className="text-xl font-serif italic text-ink leading-snug mb-4">
            « {book.hook} »
          </p>
          <p className="text-[15px] leading-relaxed text-ink/85">{book.pitch}</p>
        </section>

        {/* Incipit — SSR via <details> natif, aucun JS requis */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            L'incipit
          </h2>
          <OpeningLinesReveal openingLines={book.openingLines} />
          {book.referenceEdition && (
            <p className="text-[11px] text-ink/50 mt-3 leading-relaxed italic">
              Édition de référence : {book.referenceEdition}
              {book.translator
                ? ` · Traduction ${book.translator}${
                    book.translationYear ? ` (${book.translationYear})` : ""
                  }`
                : ""}
              .
            </p>
          )}
        </section>

        {/* Contexte historique — SSR, crawlable. Demandé par Léa (panel v7). */}
        {book.historicalContext && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Le livre dans son siècle
            </h2>
            <div className="bg-cream/60 border border-dust rounded-2xl p-5">
              <p className="text-[15px] leading-relaxed text-ink/85">
                {book.historicalContext}
              </p>
            </div>
          </section>
        )}

        {/* Avis du libraire — SSR, crawlable. Demandé par Jean-Baptiste. */}
        {book.libraireEndorsement && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              L'avis du libraire
            </h2>
            <blockquote className="bg-paper border-l-4 border-bordeaux rounded-r-2xl p-5">
              <p className="font-serif italic text-[15px] text-ink/90 leading-relaxed mb-3">
                « {book.libraireEndorsement.text} »
              </p>
              <footer className="text-[11px] uppercase tracking-widest font-bold text-ink/60">
                — {book.libraireEndorsement.libraire},{" "}
                <span className="text-bordeaux">
                  {book.libraireEndorsement.librairie}
                </span>
              </footer>
            </blockquote>
          </section>
        )}

        {/* Passages clés — SSR, crawlables */}
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
            {/* Client-side gate : 2 passages gratuits, 5 Premium (cf.
                FEATURES.passagesFull dans lib/premium). On laisse le composant
                rendre tous les passages (SEO) et appliquer le floutage au
                hydrate. */}
            <PassagesList passages={passages} />

          </section>
        )}

        {/* Thèmes + Moods — SSR */}
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

        {/* Reading buddy — SSR */}
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

        {/* Actions — ilot client pour modals AI + libraires + personnages */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
            Pour t'accompagner
          </h2>
          <BookActionPanel
            book={book}
            characters={characters}
            passagesCount={passages.length}
          />
        </section>

        {/* Où lire / écouter */}
        <ReadElsewhere book={book} />

        {/* Géolocalisation libraire — widget client, saisie code postal. */}
        <LibrairesByPostalCode book={book} />

        {/* Bio auteur — SSR, crawlable. Demandé par Camille (panel v7). */}
        {book.authorBio && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              L'auteur · {book.author}
            </h2>
            <div className="bg-paper border border-ink/10 rounded-2xl p-5 space-y-3">
              {book.authorBio.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-ink/85"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Pour aller plus loin — SSR, crawlable. Demandé par Léa. */}
        {book.goingFurther && book.goingFurther.length > 0 && (
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50 mb-3">
              Pour aller plus loin
            </h2>
            <ul className="space-y-3">
              {book.goingFurther.map((entry, i) => (
                <li
                  key={i}
                  className="bg-paper border border-ink/10 rounded-2xl p-4"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-bordeaux">
                      {kindLabel(entry.kind)}
                    </span>
                    {entry.year && (
                      <span className="text-[10px] text-ink/40 font-bold">
                        · {entry.year}
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-base font-bold text-ink leading-tight">
                    {entry.title}
                  </div>
                  <div className="text-xs text-ink/60 mb-2">
                    {entry.author}
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink/75 italic">
                    {entry.note}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Annotations publiques — SSR, crawlables */}
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

        {/* Recommandations — SSR, crawlables (excellent pour le maillage interne) */}
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

        {/* Notes — composer client, liste SSR */}
        <section>
          <NoteComposer />

          <div className="flex items-center justify-between mb-3 mt-6">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/50">
              Notes de lecture · {notes.length}
            </h2>
          </div>

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
    </>
  );
}

// Label humain pour les types d'entrées "Pour aller plus loin".
function kindLabel(kind: string): string {
  switch (kind) {
    case "essai":
      return "Essai";
    case "biographie":
      return "Biographie";
    case "correspondance":
      return "Correspondance";
    case "adaptation":
      return "Adaptation";
    case "roman":
      return "Roman";
    default:
      return kind;
  }
}
