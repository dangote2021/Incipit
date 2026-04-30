import { ImageResponse } from "next/og";
import { getBook } from "@/lib/mock-data";

// ─────────────────────────────────────────────────────────────────────────────
// app/book/[id]/opengraph-image.tsx — image OG dynamique par livre
//
// Pour chaque livre, génère une image 1200×630 mettant en scène l'incipit,
// l'auteur et l'année. Si le livre est introuvable (URL invalide), on retombe
// sur l'OG par défaut (cf. app/opengraph-image.tsx) en lançant une 404 légère.
//
// Édition à l'edge — pas de polices custom, pas d'image bitmap, pas d'appel
// réseau. Pure JSX → SVG → PNG via next/og.
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "edge";
export const alt = "Incipit — premières lignes d'un classique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: { id: string };
};

// Tronque proprement à ~180 caractères en évitant de couper un mot.
function truncate(s: string, max = 200): string {
  if (s.length <= max) return s;
  const slice = s.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace > 80 ? lastSpace : max).trimEnd() + "…";
}

export default async function BookOGImage({ params }: Props) {
  const book = getBook(params.id);

  // Fallback : livre introuvable → image neutre "Incipit" avec un message.
  if (!book) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF7F0",
            color: "#1A1A2E",
            fontSize: 56,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}
        >
          Incipit
        </div>
      ),
      { ...size }
    );
  }

  const opening = truncate(book.openingLines, 220);

  // Adapte la taille du texte à la longueur (on conserve un look "lu").
  let openingFontSize = 52;
  if (opening.length > 180) openingFontSize = 42;
  else if (opening.length > 130) openingFontSize = 46;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: "#FAF7F0",
          color: "#1A1A2E",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Guillemet décoratif filigrane */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -40,
            fontSize: 720,
            color: "#8A1234",
            opacity: 0.08,
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            display: "flex",
          }}
        >
          “
        </div>

        {/* Header — Marque */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#8A1234",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 800,
              color: "#1A1A2E",
              opacity: 0.6,
            }}
          >
            Incipit · {book.year}
          </div>
        </div>

        {/* Citation principale + signature */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
          <div
            style={{
              fontSize: openingFontSize,
              lineHeight: 1.18,
              fontStyle: "italic",
              fontWeight: 600,
              color: "#1A1A2E",
              display: "flex",
            }}
          >
            {opening}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8A1234",
              fontWeight: 700,
              display: "flex",
            }}
          >
            {book.author} · {book.title}
          </div>
        </div>

        {/* Footer — baseline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(26,26,46,0.15)",
            paddingTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#1A1A2E",
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              display: "flex",
              opacity: 0.7,
            }}
          >
            Les premières lignes qui donnent envie.
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#1A1A2E",
              opacity: 0.55,
              fontWeight: 700,
              display: "flex",
            }}
          >
            incipit.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
