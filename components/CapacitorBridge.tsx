"use client";

import { useEffect } from "react";

// Bridge Capacitor ↔ Web.
// — écoute le bouton retour Android (obligatoire pour Google Play, sinon rejet
//   en review : une app qui quitte sur backPress quand il y a un historique
//   web derrière, c'est une régression UX que Google signale systématiquement).
// — gère la transparence de la status bar iOS si le plugin est monté.
// Sur le web (pas de Capacitor monté), tout est no-op.
export default function CapacitorBridge() {
  useEffect(() => {
    let mounted = true;
    let removeBack: (() => void) | null = null;

    (async () => {
      // On charge dynamiquement pour ne pas casser le bundle web.
      type CapWindow = Window & {
        Capacitor?: { isNativePlatform?: () => boolean };
      };
      const w = window as CapWindow;
      const isNative = w.Capacitor?.isNativePlatform?.() ?? false;
      if (!isNative) return;

      try {
        // Import dynamique via variable pour que le bundler webpack ne tente
        // pas de résoudre statiquement "@capacitor/app" (qui n'est pas
        // installé tant qu'on n'a pas fait `npm install @capacitor/app`).
        // Côté web pur, le import() échoue silencieusement, l'effet s'arrête.
        const modName = "@capacitor/app";
        const appMod: unknown = await (
          new Function("m", "return import(m)") as (m: string) => Promise<unknown>
        )(modName).catch(() => null);
        if (!mounted || !appMod) return;
        const App = (appMod as { App?: unknown }).App as
          | {
              addListener: (
                event: string,
                cb: (data: { canGoBack: boolean }) => void,
              ) => Promise<{ remove: () => void }>;
              exitApp: () => Promise<void>;
            }
          | undefined;
        if (!App) return;

        const handle = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack && typeof window !== "undefined") {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
        removeBack = () => {
          try {
            handle.remove();
          } catch {
            /* noop */
          }
        };
      } catch {
        // Pas grave, app web seule.
      }
    })();

    return () => {
      mounted = false;
      if (removeBack) removeBack();
    };
  }, []);

  return null;
}
