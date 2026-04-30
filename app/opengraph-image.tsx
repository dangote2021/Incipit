import { ImageResponse } from "next/og";

// ─────────────────────────────────────────────────────────────────────────────
// app/opengraph-image.tsx — image OG par défaut, générée à l'edge.
//
// Next.js 14 détecte ce fichier et l'utilise comme og:image / twitter:image
// pour toute route qui ne déclare pas la sienne. 1200×630 est le format
// standard Facebook/Twitter/LinkedIn.
//
// On garde le rendu en pur SVG-via-JSX (next/og) — pas d'image bitmap, pas
// de polices custom à embed, pas de CDN externe. Le résultat est cohérent
// avec l'identité visuelle de l'app (paper, ink, bordeaux, typo serif).
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "edge";
export const alt = "Incipit — Les premières lignes qui donnent envie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
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
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 800,
              color: "#1A1A2E",
              opacity: 0.6,
            }}
          >
            Incipit · in-ki-pit
          </div>
        </div>

        {/* Citation principale + signature */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              fontStyle: "italic",
              fontWeight: 700,
              color: "#1A1A2E",
              maxWidth: 980,
              display: "flex",
            }}
          >
            Longtemps, je me suis couché de bonne heure.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8A1234",
              fontWeight: 700,
              display: "flex",
            }}
          >
            Marcel Proust · 1913
          </div>
        </div>

        {/* Footer — baseline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(26,26,46,0.15)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#1A1A2E",
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            Les premières lignes qui donnent envie.
          </div>
          <div
            style={{
              fontSize: 20,
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
