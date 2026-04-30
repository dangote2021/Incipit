"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Book, Quote } from "@/lib/types";
import { track } from "@/lib/telemetry";

type Props = {
  quote: Quote;
  book: Book;
  open: boolean;
  onClose: () => void;
};

// ─── Tailwind color → hex (on ne charge que ce qu'on utilise réellement) ───
const TW: Record<string, string> = {
  // Neutres
  black: "#000000",
  white: "#ffffff",
  // Stone / zinc / slate / gray / neutral
  "stone-400": "#a8a29e",
  "stone-600": "#57534e",
  "stone-800": "#292524",
  "stone-900": "#1c1917",
  "slate-700": "#334155",
  "gray-800": "#1f2937",
  "zinc-800": "#27272a",
  "zinc-900": "#18181b",
  "neutral-700": "#404040",
  "neutral-800": "#262626",
  "neutral-900": "#171717",
  // Ambres / oranges / jaunes
  "amber-100": "#fef3c7",
  "amber-300": "#fcd34d",
  "amber-400": "#fbbf24",
  "amber-500": "#f59e0b",
  "amber-700": "#b45309",
  "orange-200": "#fed7aa",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "yellow-300": "#fde047",
  "yellow-500": "#eab308",
  // Roses / rouges
  "rose-200": "#fecdd3",
  "rose-300": "#fda4af",
  "rose-400": "#fb7185",
  "rose-900": "#881337",
  "pink-300": "#f9a8d4",
  "pink-400": "#f472b6",
  "red-300": "#fca5a5",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-900": "#7f1d1d",
  "red-950": "#450a0a",
  // Violets / indigos
  "purple-900": "#581c87",
  "violet-400": "#a78bfa",
  "violet-600": "#7c3aed",
  "violet-700": "#6d28d9",
  "violet-800": "#5b21b6",
  "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8",
  "indigo-900": "#312e81",
  // Bleus
  "sky-200": "#bae6fd",
  "sky-300": "#7dd3fc",
  // Verts / lime / teal / emerald / cyan
  "lime-300": "#bef264",
  "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399",
  "teal-500": "#14b8a6",
  "cyan-700": "#0e7490",
  // Incipit
  bordeaux: "#8B1E3F",
  ink: "#1A1A2E",
  paper: "#FAF7F0",
};

function parseGradient(cover: string): [string, string, string] {
  // "from-amber-100 via-orange-200 to-yellow-300" → 3 hex
  const classes = cover.split(" ");
  const getToken = (prefix: string) => {
    const c = classes.find((x) => x.startsWith(prefix));
    return c ? c.slice(prefix.length) : null;
  };
  const from = getToken("from-");
  const via = getToken("via-");
  const to = getToken("to-");
  const c1 = (from && TW[from]) || "#1A1A2E";
  const c3 = (to && TW[to]) || "#8B1E3F";
  const c2 = (via && TW[via]) || c1;
  return [c1, c2, c3];
}

// Couleur de texte adaptée (clair ou foncé) selon la luminosité moyenne
function isDarkGradient(hexes: [string, string, string]): boolean {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };
  const avg = (lum(hexes[0]) + lum(hexes[1]) + lum(hexes[2])) / 3;
  return avg < 0.55;
}

// Wrap un texte sur plusieurs lignes avec un max de caractères
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    const m = ctx.measureText(test);
    if (m.width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function QuoteStoryCard({ quote, book, open, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const titleId = useId();

  // Echap pour fermer le modal
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setReady(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [c1, c2, c3] = parseGradient(book.cover);
    const dark = isDarkGradient([c1, c2, c3]);
    const fg = dark ? "#FAF7F0" : "#1A1A2E";
    const fgSoft = dark ? "rgba(250,247,240,0.75)" : "rgba(26,26,46,0.70)";
    const accent = "#C9A961";

    const drawAll = () => {
      // Background gradient (diagonale douce)
      const grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, c1);
      grd.addColorStop(0.55, c2);
      grd.addColorStop(1, c3);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Voile doux pour la lisibilité
      const veil = ctx.createRadialGradient(W / 2, H * 0.42, W * 0.2, W / 2, H * 0.5, W * 0.9);
      veil.addColorStop(0, dark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)");
      veil.addColorStop(1, dark ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.2)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, W, H);

      // Texture paper subtile (petits points)
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.012)";
        const x = Math.random() * W;
        const y = Math.random() * H;
        ctx.fillRect(x, y, 2, 2);
      }

      // Wordmark "INCIPIT" en haut
      ctx.fillStyle = fg;
      ctx.font = 'bold 32px "Inter", system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      // letter-spacing manuel
      const brand = "I  N  C  I  P  I  T";
      ctx.fillText(brand, W / 2, 120);

      // Petite barre dorée sous le wordmark
      ctx.fillStyle = accent;
      ctx.fillRect(W / 2 - 60, 180, 120, 3);

      // Baseline
      ctx.fillStyle = fgSoft;
      ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
      ctx.fillText("les premières lignes qui donnent envie", W / 2, 210);

      // ── Guillemet décoratif ──
      ctx.fillStyle = fg;
      ctx.globalAlpha = 0.22;
      ctx.font = 'bold 320px "Playfair Display", Georgia, serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("“", 90, 360);
      ctx.globalAlpha = 1;

      // ── Citation (au centre) ──
      ctx.fillStyle = fg;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Tailles candidates pour trouver la bonne taille selon la longueur
      const maxWidth = W - 180; // marges 90 px
      const lineHeight = (size: number) => Math.round(size * 1.2);

      // Choisit une taille selon la longueur de la citation
      const txt = quote.text.trim();
      const size =
        txt.length < 55 ? 94 :
        txt.length < 110 ? 78 :
        txt.length < 180 ? 64 :
        txt.length < 260 ? 54 :
        46;

      ctx.font = `italic 700 ${size}px "Playfair Display", Georgia, serif`;
      const lines = wrapLines(ctx, txt, maxWidth);
      const lh = lineHeight(size);
      const blockH = lines.length * lh;
      const startY = Math.max(560, (H - blockH) / 2 - 80);
      lines.forEach((l, i) => {
        ctx.fillText(l, 90, startY + i * lh);
      });

      // Contexte (si présent)
      if (quote.context) {
        ctx.fillStyle = fgSoft;
        ctx.font = 'bold 26px "Inter", system-ui, sans-serif';
        ctx.fillText("— " + quote.context, 90, startY + blockH + 30);
      }

      // ── Crédit livre en bas ──
      const creditY = H - 380;

      // Séparateur doré
      ctx.fillStyle = accent;
      ctx.fillRect(90, creditY, 80, 3);

      ctx.fillStyle = fg;
      ctx.textAlign = "left";
      ctx.font = 'bold 28px "Inter", system-ui, sans-serif';
      ctx.fillText("EXTRAIT DE", 90, creditY + 30);

      ctx.font = 'bold 900 70px "Playfair Display", Georgia, serif';
      // Wrap titre si trop long
      ctx.font = 'bold 900 70px "Playfair Display", Georgia, serif';
      const titleLines = wrapLines(ctx, book.title, maxWidth);
      titleLines.forEach((l, i) => {
        ctx.fillText(l, 90, creditY + 80 + i * 78);
      });

      ctx.fillStyle = fgSoft;
      ctx.font = '500 38px "Inter", system-ui, sans-serif';
      ctx.fillText(
        `${book.author} · ${book.year}`,
        90,
        creditY + 80 + titleLines.length * 78 + 10
      );

      // URL watermark discret en bas à droite
      ctx.fillStyle = fgSoft;
      ctx.textAlign = "right";
      ctx.font = 'bold 22px "Inter", system-ui, sans-serif';
      ctx.fillText("incipit.app", W - 90, H - 70);

      setReady(true);
    };

    // Attendre les fonts si possible
    const maybeFonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (maybeFonts && typeof maybeFonts.load === "function") {
      Promise.all([
        maybeFonts.load('italic 700 78px "Playfair Display"'),
        maybeFonts.load('bold 900 70px "Playfair Display"'),
        maybeFonts.load('bold 32px "Inter"'),
        maybeFonts.load('italic 26px "Playfair Display"'),
      ])
        .then(() => drawAll())
        .catch(() => drawAll());
    } else {
      drawAll();
    }
  }, [open, book, quote]);

  if (!open) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `incipit-${book.id}-${quote.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    track("share_clicked", {
      surface: "quote_card",
      method: "download",
      book_id: book.id,
    });
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `incipit-${book.id}-${quote.id}.png`, {
        type: "image/png",
      });
      type ShareNavigator = Navigator & {
        canShare?: (d: { files?: File[] }) => boolean;
        share?: (d: { files?: File[]; title?: string; text?: string }) => Promise<void>;
      };
      const nav = navigator as ShareNavigator;
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        try {
          await nav.share({
            files: [file],
            title: `« ${quote.text} »`,
            text: `— ${book.author}, ${book.title} · via Incipit`,
          });
          track("share_clicked", {
            surface: "quote_card",
            method: "native_share",
            book_id: book.id,
          });
          return;
        } catch {
          /* user cancelled */
        }
      }
      // Fallback : download (track inside handleDownload).
      handleDownload();
    }, "image/png");
  };

  const handleCopyText = async () => {
    const line = `« ${quote.text} » — ${book.author}, ${book.title}\n\nvia Incipit`;
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      track("share_clicked", {
        surface: "quote_card",
        method: "copy_text",
        book_id: book.id,
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-paper w-full sm:max-w-md max-h-[92vh] overflow-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-paper/95 backdrop-blur border-b border-ink/10 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-bordeaux font-bold">
              Carte à partager
            </div>
            <h3 id={titleId} className="font-serif text-xl font-bold text-ink leading-tight">
              Format Stories
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/50 text-2xl font-bold w-11 h-11 flex items-center justify-center hover:text-ink transition"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Preview */}
          <div className="relative mx-auto rounded-2xl overflow-hidden bg-ink/5" style={{ width: 270, height: 480 }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ width: 270, height: 480 }}
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-ink/50 text-xs uppercase tracking-widest">
                génération…
              </div>
            )}
          </div>

          <p className="text-xs text-ink/60 text-center italic">
            1080 × 1920 · ratio Instagram / TikTok / Snapchat
          </p>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-full min-h-[44px] bg-bordeaux text-paper py-3 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-red-800 transition flex items-center justify-center gap-2"
            >
              <span>📲</span> Partager
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-[44px] bg-ink/10 text-ink py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-ink/20 transition"
              >
                ⬇ Télécharger
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                className="min-h-[44px] bg-ink/10 text-ink py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-ink/20 transition"
              >
                {copied ? "✓ Copié" : "📋 Copier texte"}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-ink/50 leading-relaxed text-center pt-2">
            Extrait court, usage privé — conforme à l'article L.122-5 CPI
            (courte citation).
          </p>
        </div>
      </div>
    </div>
  );
}
