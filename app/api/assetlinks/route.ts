// ─────────────────────────────────────────────────────────────────────────────
// /api/assetlinks — sert le Digital Asset Links JSON pour validation TWA
// Android (PWABuilder/Bubblewrap → Play Store).
//
// Pourquoi pas un fichier statique en /public/.well-known/assetlinks.json ?
// Parce que Next.js ignore les fichiers commençant par "." dans /public/
// (sécurité : évite de servir .env, .git, etc. par accident). Vercel hérite
// de ce comportement.
//
// Workflow :
//   1. Vercel rewrite (vercel.json) : /.well-known/assetlinks.json → /api/assetlinks
//   2. Cette route renvoie le JSON avec Content-Type: application/json
//   3. Google Digital Asset Links API valide la TWA association
//
// Le fingerprint SHA256 vient du keystore généré par PWABuilder. Si tu
// changes de keystore (ou si Google active Play App Signing avec une autre
// clé), update le tableau ci-dessous.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";

const ASSET_LINKS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "app.incipit.reader",
      sha256_cert_fingerprints: [
        "7A:18:2B:B3:27:F4:0D:33:15:80:3A:CD:1F:E5:D5:46:EB:75:1F:D4:2A:91:93:C5:FD:F4:19:9C:01:C2:A8:4A",
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(ASSET_LINKS, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
