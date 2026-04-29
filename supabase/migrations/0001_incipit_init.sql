-- ─────────────────────────────────────────────────────────────────────────────
-- Incipit — tables backend v2 (cohabitation Adventurer dans le même projet
-- Supabase). Toutes les tables sont préfixées `incipit_` pour rester isolées
-- de l'existant Adventurer (`profiles`, `activities`, `spots`, etc.).
--
-- Auth.users est PARTAGÉ : un même user peut avoir un profil Adventurer
-- (public.profiles) ET un profil Incipit (public.incipit_profiles). Pas de
-- trigger automatique sur auth.users — chaque app crée sa ligne au premier
-- login (lazy upsert depuis /api/sync/push).
--
-- Cette migration a été appliquée sur le projet adventurer
-- (avldyvgvouzpeprygvyw) via Supabase MCP. Elle est conservée ici pour
-- versionnage / rejeu en cas de besoin.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── incipit_profiles ─────────────────────────────────────────────────────
create table if not exists public.incipit_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text not null default '',
    genres text[] not null default '{}',
    tone text not null default 'boloss',
    hide_streak boolean not null default false,
    onboarded_at timestamptz,
    last_seen_at timestamptz,
    visits integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.incipit_profiles enable row level security;

drop policy if exists "incipit_profiles_self_select" on public.incipit_profiles;
create policy "incipit_profiles_self_select" on public.incipit_profiles
    for select using (auth.uid() = id);
drop policy if exists "incipit_profiles_self_insert" on public.incipit_profiles;
create policy "incipit_profiles_self_insert" on public.incipit_profiles
    for insert with check (auth.uid() = id);
drop policy if exists "incipit_profiles_self_update" on public.incipit_profiles;
create policy "incipit_profiles_self_update" on public.incipit_profiles
    for update using (auth.uid() = id);

-- ─── incipit_favorites ────────────────────────────────────────────────────
create table if not exists public.incipit_favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    fav_id text not null,
    kind text not null check (kind in ('incipit','quote','punchline','passage','book')),
    label text not null,
    sub text,
    href text not null,
    added_at timestamptz not null default now(),
    unique (user_id, fav_id)
);
create index if not exists incipit_favorites_user_added_idx
    on public.incipit_favorites (user_id, added_at desc);

alter table public.incipit_favorites enable row level security;

drop policy if exists "incipit_favorites_self_all" on public.incipit_favorites;
create policy "incipit_favorites_self_all" on public.incipit_favorites
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── incipit_streaks ──────────────────────────────────────────────────────
create table if not exists public.incipit_streaks (
    user_id uuid primary key references auth.users(id) on delete cascade,
    current integer not null default 0,
    longest integer not null default 0,
    last_open date,
    total_days integer not null default 0,
    celebrated integer[] not null default '{}',
    updated_at timestamptz not null default now()
);

alter table public.incipit_streaks enable row level security;

drop policy if exists "incipit_streaks_self_all" on public.incipit_streaks;
create policy "incipit_streaks_self_all" on public.incipit_streaks
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── incipit_premium ──────────────────────────────────────────────────────
create table if not exists public.incipit_premium (
    user_id uuid primary key references auth.users(id) on delete cascade,
    is_premium boolean not null default false,
    activated_at timestamptz,
    trial_ends_at timestamptz,
    stripe_customer_id text,
    stripe_subscription_id text,
    current_period_end timestamptz,
    updated_at timestamptz not null default now()
);
create index if not exists incipit_premium_stripe_customer_idx
    on public.incipit_premium (stripe_customer_id);
create index if not exists incipit_premium_stripe_sub_idx
    on public.incipit_premium (stripe_subscription_id);

alter table public.incipit_premium enable row level security;

drop policy if exists "incipit_premium_self_select" on public.incipit_premium;
create policy "incipit_premium_self_select" on public.incipit_premium
    for select using (auth.uid() = user_id);

-- ─── incipit_push_subscriptions ───────────────────────────────────────────
create table if not exists public.incipit_push_subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    endpoint text not null unique,
    p256dh text not null,
    auth text not null,
    user_agent text,
    created_at timestamptz not null default now()
);
create index if not exists incipit_push_subs_user_idx
    on public.incipit_push_subscriptions (user_id);

alter table public.incipit_push_subscriptions enable row level security;

drop policy if exists "incipit_push_subs_self_select" on public.incipit_push_subscriptions;
create policy "incipit_push_subs_self_select" on public.incipit_push_subscriptions
    for select using (auth.uid() = user_id);
drop policy if exists "incipit_push_subs_self_delete" on public.incipit_push_subscriptions;
create policy "incipit_push_subs_self_delete" on public.incipit_push_subscriptions
    for delete using (auth.uid() = user_id);

-- ─── incipit_telemetry_events ─────────────────────────────────────────────
create table if not exists public.incipit_telemetry_events (
    id uuid primary key default gen_random_uuid(),
    event text not null,
    session_id text not null,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);
create index if not exists incipit_telemetry_event_created_idx
    on public.incipit_telemetry_events (event, created_at desc);
create index if not exists incipit_telemetry_session_idx
    on public.incipit_telemetry_events (session_id);

alter table public.incipit_telemetry_events enable row level security;

-- ─── incipit_rate_limits ──────────────────────────────────────────────────
create table if not exists public.incipit_rate_limits (
    key text primary key,
    count integer not null default 0,
    window_start timestamptz not null default now()
);

alter table public.incipit_rate_limits enable row level security;

-- ─── Helper RPC : upsert_incipit_streak ───────────────────────────────────
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
$$ language plpgsql security invoker;

-- ─── Trigger updated_at ───────────────────────────────────────────────────
do $$
begin
    if not exists (
        select 1 from pg_proc where proname = 'touch_updated_at'
    ) then
        create or replace function public.touch_updated_at()
        returns trigger as $body$
        begin
            new.updated_at = now();
            return new;
        end;
        $body$ language plpgsql;
    end if;
end$$;

drop trigger if exists incipit_profiles_touch on public.incipit_profiles;
create trigger incipit_profiles_touch before update on public.incipit_profiles
    for each row execute function public.touch_updated_at();

drop trigger if exists incipit_streaks_touch on public.incipit_streaks;
create trigger incipit_streaks_touch before update on public.incipit_streaks
    for each row execute function public.touch_updated_at();

drop trigger if exists incipit_premium_touch on public.incipit_premium;
create trigger incipit_premium_touch before update on public.incipit_premium
    for each row execute function public.touch_updated_at();
