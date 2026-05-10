// ─────────────────────────────────────────────────────────────────────────────
// /admin/beta — page d'admin minimale pour valider les candidatures beta.
//
// Protection : check d'un cookie 'incipit_admin' qui doit valoir
// process.env.INCIPIT_ADMIN_TOKEN. Si absent → 404 (silent fail).
// Pour accéder en local : ajouter manuellement le cookie via devtools.
//
// Affiche : liste des candidats pending, motivation, devices, bouton
// approuver / rejeter. Approuvé → status='approved' + on copie l'email
// Google Play à coller dans la liste de testeurs Play Console.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminSupabase } from "@/lib/supabase/server";
import { hasSupabaseAdmin } from "@/lib/supabase/env";
import AdminActions from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBetaPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const adminToken = process.env.INCIPIT_ADMIN_TOKEN;
  const cookieToken = cookies().get("incipit_admin")?.value;
  if (!adminToken || cookieToken !== adminToken) {
    notFound();
  }
  if (!hasSupabaseAdmin()) {
    return <p className="p-6">Supabase admin non configuré.</p>;
  }

  const status = searchParams?.status ?? "pending";
  const admin = adminSupabase()!;
  const { data: rows, error } = await admin
    .from("incipit_beta_testers")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <p className="p-6 text-red-700">Erreur : {error.message}</p>;
  }

  return (
    <main className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl font-black text-ink mb-2">
        Admin · Beta candidats
      </h1>
      <p className="text-sm text-ink/60 mb-6">
        {rows?.length ?? 0} candidat(s) en {status}
      </p>

      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "active", "rejected"] as const).map((s) => (
          <a
            key={s}
            href={`/admin/beta?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold transition ${
              status === s
                ? "bg-ink text-paper"
                : "bg-ink/5 text-ink/60 hover:bg-ink/10"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      <ul className="space-y-3">
        {rows?.map((r) => (
          <li
            key={r.id}
            className="bg-paper border border-ink/10 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="font-serif font-bold text-ink">
                  {r.full_name || "(sans nom)"}
                </div>
                <div className="text-xs text-ink/60">{r.email}</div>
                {r.google_play_email &&
                  r.google_play_email !== r.email && (
                    <div className="text-xs text-bordeaux">
                      Play : {r.google_play_email}
                    </div>
                  )}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink/50">
                {new Date(r.created_at).toLocaleDateString("fr-FR")}
              </div>
            </div>

            {r.motivation && (
              <p className="text-sm text-ink/80 italic font-serif leading-relaxed mb-3">
                « {r.motivation} »
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-ink/55 mb-3">
              {r.device_android && <span>📱 Android</span>}
              {r.device_ios && <span>🍎 iOS</span>}
              {!r.device_android && !r.device_ios && (
                <span>⚠️ Aucun device coché</span>
              )}
            </div>

            <AdminActions id={r.id} currentStatus={r.status} />
          </li>
        ))}
        {(!rows || rows.length === 0) && (
          <li className="text-center text-ink/50 py-12 italic">
            Aucun candidat en {status}.
          </li>
        )}
      </ul>
    </main>
  );
}
