"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// useAuth — état de session côté client.
//
// `user` : null si déconnecté OU si Supabase n'est pas configuré (mode V1).
// `ready` : true quand on a fait le premier appel getSession (évite flash).
// `configured` : false si Supabase n'est pas branché (affiche "connexion
//   bientôt dispo" au lieu du bouton login).
// ─────────────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  email: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) {
      setReady(true);
      setConfigured(false);
      return;
    }
    setConfigured(true);

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const u = data.session?.user;
      setUser(u ? { id: u.id, email: u.email ?? null } : null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? null } : null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, ready, configured };
}

export async function signOut() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }
  const supabase = browserSupabase();
  if (supabase) await supabase.auth.signOut();
}
