-- ─────────────────────────────────────────────────────────────────────────────
-- 0002_incipit_security_hardening
--
-- Corrige les avis de sécurité Supabase pour Incipit :
--   1. `incipit_rate_limits` : RLS activée mais aucune policy → policy déni
--      explicite pour anon/authenticated. Toute écriture passe par le
--      service_role (qui bypasse RLS), donc aucun impact fonctionnel.
--   2. `incipit_telemetry_events` : idem. La route /api/telemetry/event
--      utilise admin.from(...) (service_role), pas le client anon.
--   3. `upsert_incipit_streak` : ajoute `set search_path` pour neutraliser
--      les attaques par schéma muable (CVE-style search_path hijacking).
--
-- Ces changements n'altèrent aucun comportement existant — l'app n'écrit
-- jamais directement ces tables depuis un client anon ou authenticated.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── incipit_rate_limits : verrou explicite ──────────────────────────────────
drop policy if exists "incipit_rate_limits_no_client_access" on public.incipit_rate_limits;
create policy "incipit_rate_limits_no_client_access" on public.incipit_rate_limits
    as restrictive
    for all
    to anon, authenticated
    using (false)
    with check (false);

-- ─── incipit_telemetry_events : verrou explicite ─────────────────────────────
drop policy if exists "incipit_telemetry_no_client_access" on public.incipit_telemetry_events;
create policy "incipit_telemetry_no_client_access" on public.incipit_telemetry_events
    as restrictive
    for all
    to anon, authenticated
    using (false)
    with check (false);

-- ─── upsert_incipit_streak : search_path figé ────────────────────────────────
create or replace function public.upsert_incipit_streak(
    p_current integer,
    p_longest integer,
    p_last_open date,
    p_total_days integer,
    p_celebrated integer[]
)
returns void as $$
begin
    insert into public.incipit_streaks
        (user_id, current, longest, last_open, total_days, celebrated, updated_at)
    values
        (auth.uid(), p_current, p_longest, p_last_open, p_total_days, p_celebrated, now())
    on conflict (user_id) do update set
        current = excluded.current,
        longest = greatest(public.incipit_streaks.longest, excluded.longest),
        last_open = excluded.last_open,
        total_days = greatest(public.incipit_streaks.total_days, excluded.total_days),
        celebrated = excluded.celebrated,
        updated_at = now();
end;
$$ language plpgsql
   security invoker
   set search_path = public, pg_catalog;
