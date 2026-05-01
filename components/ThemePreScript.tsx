// ─────────────────────────────────────────────────────────────────────────────
// <ThemePreScript /> — script bloquant inséré dans <head>.
//
// Lit `incipit-theme` dans localStorage AVANT le 1er paint et applique
// la classe `.dark` au <html>. Sans ça, un user en mode sombre verrait
// un flash blanc à chaque chargement / navigation hard.
//
// On utilise dangerouslySetInnerHTML pour injecter du JS inline non parsé
// par React (sinon ça partirait dans bundle.js et s'exécuterait trop tard).
// ─────────────────────────────────────────────────────────────────────────────

export default function ThemePreScript() {
  const code = `(function(){try{var t=localStorage.getItem('incipit-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||((t===null||t==='system')&&d);if(dark){document.documentElement.classList.add('dark');}var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content',dark?'#0F0F1A':'#FAF7F0');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
