import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getBook } from "@/lib/mock-data";
import { incipitTeaser, formatDate } from "@/lib/daily-incipit";

export const runtime = "edge";

// Carte partageable format Instagram post (1080×1350, ratio 4:5).
// Renvoie un PNG statique que l'utilisateur peut long-press → sauvegarder
// sur iOS/Android, puis publier en story ou en post. Pas de JS côté client,
// pas de librairie canvas — juste un rendu serveur propre.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const book = getBook(params.id);
  if (!book) return NextResponse.json({ error: "not found" }, { status: 404 });

  const teaser = incipitTeaser(book, 260);
  const today = formatDate(new Date());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px 56px 72px",
          backgroundColor: "#FAF7F0",
          color: "#1A1A2E",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Éléments décoratifs — grand guillemet filigrane */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "48px",
            fontSize: "320px",
            color: "#8B1E3F",
            opacity: 0.12,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            display: "flex",
          }}
        >
          “
        </div>

        {/* Header : branding + date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#8B1E3F",
          }}
        >
          <div style={{ display: "flex" }}>Incipit · du jour</div>
          <div
            style={{
              display: "flex",
              color: "rgba(26, 26, 46, 0.5)",
              fontSize: "18px",
              letterSpacing: "4px",
            }}
          >
            {today}
          </div>
        </div>

        {/* Bloc citation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: teaser.length > 180 ? "48px" : "56px",
              lineHeight: 1.25,
              fontStyle: "italic",
              fontWeight: 400,
              display: "flex",
            }}
          >
            « {teaser} »
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                fontWeight: 900,
                display: "flex",
              }}
            >
              {book.title}
            </div>
            <div
              style={{
                fontSize: "26px",
                color: "rgba(26, 26, 46, 0.7)",
                display: "flex",
              }}
            >
              {book.author} · {book.year}
            </div>
          </div>
        </div>

        {/* Footer : mood + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(26, 26, 46, 0.12)",
            paddingTop: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "rgba(26, 26, 46, 0.5)",
                fontWeight: 700,
                display: "flex",
              }}
            >
              Le pitch
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "rgba(26, 26, 46, 0.85)",
                fontStyle: "italic",
                maxWidth: "720px",
                display: "flex",
              }}
            >
              « {book.hook} »
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#8B1E3F",
              fontWeight: 700,
            }}
          >
            incipit.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
    }
  );
}
