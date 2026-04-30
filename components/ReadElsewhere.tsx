"use client";

import type { Book } from "@/lib/types";
import { buildConnectors, groupConnectors } from "@/lib/connectors";

/**
 * ReadElsewhere — le bloc "Où lire / écouter ce livre".
 *
 * On ne retient pas le lecteur dans Incipit : on le renvoie vers son
 * écosystème préféré (Audible, Kindle, Kobo, Apple Books, Google Play,
 * libraire indé). Pour les œuvres du domaine public, on propose en plus
 * Gutenberg, Wikisource et Gallica — gratuit et légal.
 */
export default function ReadElsewhere({ book }: { book: Book }) {
  const connectors = buildConnectors(book);
  const groups = groupConnectors(connectors);

  return (
    <section className="rounded-3xl border border-ink/10 bg-paper/70 backdrop-blur-sm p-5 space-y-5">
      <header>
        <div className="text-[10px] uppercase tracking-[0.3em] text-bordeaux font-bold mb-1">
          Où lire ou écouter
        </div>
        <h3 className="font-serif text-xl font-bold text-ink">
          {book.publicDomain
            ? "Gratuit (domaine public) ou sur ta plateforme préférée"
            : "Chez toi, sur ta plateforme préférée"}
        </h3>
        <p className="text-[13px] text-ink/65 mt-1 leading-relaxed">
          On n'héberge pas les livres — on te renvoie vers l'endroit où tu lis
          déjà. {book.publicDomain && "Et si tu préfères la lecture gratuite, le texte intégral est dispo en ligne."}
        </p>
      </header>

      {book.publicDomain && (
        <ConnectorGroup
          title="Lecture intégrale · gratuite"
          subtitle="Texte libre de droits en France (auteur mort depuis plus de 70 ans)"
          connectors={connectors.filter((c) => c.publicDomainOnly)}
        />
      )}

      {groups.audio.length > 0 && (
        <ConnectorGroup
          title="Écouter"
          subtitle="Version livre audio"
          connectors={groups.audio}
        />
      )}

      {groups.ebook.filter((c) => !c.publicDomainOnly).length > 0 && (
        <ConnectorGroup
          title="Ebook"
          subtitle="Sur ta liseuse ou ton téléphone"
          connectors={groups.ebook.filter((c) => !c.publicDomainOnly)}
        />
      )}

      {groups.papier.length > 0 && (
        <ConnectorGroup
          title="Papier"
          subtitle="On priorise les libraires indépendants"
          connectors={groups.papier}
        />
      )}
    </section>
  );
}

function ConnectorGroup({
  title,
  subtitle,
  connectors,
}: {
  title: string;
  subtitle: string;
  connectors: ReturnType<typeof buildConnectors>;
}) {
  if (!connectors.length) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.25em] text-ink/50 font-bold mb-1">
        {title}
      </div>
      <div className="text-[12px] text-ink/60 mb-2.5">{subtitle}</div>
      <div className="flex flex-wrap gap-2">
        {connectors.map((c) => (
          <a
            key={c.kind}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.label} — ouvre dans un nouvel onglet`}
            className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-full transition hover:opacity-85 ${c.accent}`}
          >
            {c.label} <span className="opacity-70" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
