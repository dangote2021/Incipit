/** @type {import('next').NextConfig} */

// Headers de sécurité standard. On reste volontairement souple sur la CSP :
// l'app embarque du Tailwind / next/font / Service Worker, et on charge des
// images cross-origin (Unsplash, OpenLibrary). Une CSP trop stricte casserait
// le rendu — on couvre ici les vecteurs faciles (clickjacking, sniffing,
// referrer leak) et on laisse la CSP "report-only" pour une itération
// ultérieure.
const securityHeaders = [
  // Empêche le rendu en iframe externe (anti-clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Bloque le MIME-type sniffing (anti-XSS sur uploads).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limite ce qu'on envoie en Referer aux origines tierces.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // HSTS — Vercel met ça déjà mais on est explicite.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Restreint les API navigateur sensibles (caméra, micro, géoloc) :
  // on ne les utilise pas, on les coupe.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
    ],
  },
  async headers() {
    return [
      {
        // Applique à toutes les routes (Next merge avec ses propres headers).
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
