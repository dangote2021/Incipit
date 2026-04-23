-- ─────────────────────────────────────────────────────────────────────────────
-- Incipit — migration initiale (backend v2)
--
-- Toutes les tables sont RLS-on dès la création (seul l'utilisateur accède à
-- ses propres lignes, sauf tables publiques). Les policies utilisent
-- auth.uid() côté Supabase.
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions utiles (uuid, btree_gin pour métadonnées).
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── profiles ────────────────────────────────────────────────────────────
-- Miroir de lib/prefs.ts (côté serveur, autoritaire après login).
create table if not exists public.profiles (
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

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
    for select using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles
    for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
    for update using (auth.uid() = id);

-- Auto-crée un profil vide dès qu'un user est créé (magic link, OAuth, etc.)
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id) values (new.id)
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ─── favorites ───────────────────────────────────────────────────────────
create table if not exists public.favorites (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    fav_id text not null,
    kind text not null check (kind in ('incipit','quote','punchline','passage','book')),
    label text not null,
    sub text,
    href text not null,
    added_at timestamptz not null default now(),
    unique (user_id, fav_id)
);
create index if not exists favorites_user_added_idx on public.favorites (user_id, added_at desc);

alter table public.favorites enable row level security;

create policy "favorites_self_all" on public.favorites
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── streaks ─────────────────────────────────────────────────────────────
create table if not exists public.streaks (
    user_id uuid primary key references auth.users(id) on delete cascade,
    current integer not null default 0,
    longest integer not null default 0,
    last_open date,
    total_days integer not null default 0,
    celebrated integer[] not null default '{}',
    updated_at timestamptz not null default now()
);

alter table public.streaks enable row level security;

create policy "streaks_self_all" on public.streaks
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── premium ─────────────────────────────────────────────────────────────
-- Source de vérité : webhook Stripe. Le client lit via RLS.
create table if not exists public.premium (
    user_id uuid primary key references auth.users(id) on delete cascade,
    is_premium boolean not null default false,
    activated_at timestamptz,
    trial_ends_at timestamptz,
    stripe_customer_id text,
    stripe_subscription_id text,
    current_period_end timestamptz,
    updated_at timestamptz not null default now()
);
create index if not exists premium_stripe_customer_idx on public.premium (stripe_customer_id);
create index if not exists premium_stripe_sub_idx on public.premium (stripe_subscription_id);

alter table public.premium enable row level security;

-- Lecture seule côté client (écriture = webhook via service_role).
create policy "premium_self_select" on public.premium
    for select using (auth.uid() = user_id);

-- ─── push_subscriptions ──────────────────────────────────────────────────
create table if not exists public.push_subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    endpoint text not null unique,
    p256dh text not null,
    auth text not null,
    user_agent text,
    created_at timestamptz not null default now()
);
create index if not exists push_subs_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

-- L'utilisateur gère ses propres abonnements (et les anonymes via endpoint).
create policy "push_subs_self_select" on public.push_subscriptions
    for select using (auth.uid() = user_id);
create policy "push_subs_self_delete" on public.push_subscriptions
    for delete using (auth.uid() = user_id);
-- Les insertions passent par une route API server-side (service_role).

-- ─── telemetry_events ────────────────────────────────────────────────────
-- Pas de PII. `session_id` = hash anonyme rotate 24h côté client.
create table if not exists public.telemetry_events (
    id uuid primary key default uuid_generate_v4(),
    event text not null,
    session_id text not null,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);
create index if not exists telemetry_event_created_idx on public.telemetry_events (event, created_at desc);
create index if not exists telemetry_session_idx on public.telemetry_events (session_id);

-- Lecture/écriture via service_role uniquement (pas d'expo client).
alter table public.telemetry_events enable row level security;

-- ─── rate_limits ─────────────────────────────────────────────────────────
-- Compteurs simples par IP/endpoint (fenêtre glissante 1h).
create table if not exists public.rate_limits (
    key text primary key,
    count integer not null default 0,
    window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
-- Accès service_role uniquement.

-- ─── Fonction helper : upsert streak ─────────────────────────────────────
-- Simplifie le sync depuis le client.
create or replace function public.upsert_streak(
    p_current integer,
    p_longest integer,
    p_last_open date,
    p_total_days integer,
    p_celebrated integer[]
)
returns void as $$
begin
    insert into public.streaks (user_id, current, longest, last_open, total_days, celebrated, updated_at)
    values (auth.uid(), p_current, p_longest, p_last_open, p_total_days, p_celebrated, now())
    on conflict (user_id) do update set
        current = excluded.current,
        longest = greatest(public.streaks.longest, excluded.longest),
        last_open = excluded.last_open,
        total_days = greatest(public.streaks.total_days, excluded.total_days),
        celebrated = excluded.celebrated,
        updated_at = now();
end;
$$ language plpgsql security invoker;

-- Trigger updated_at générique
create or replace function public.touch_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
    for each row execute function public.touch_updated_at();

drop trigger if exists streaks_touch on public.streaks;
create trigger streaks_touch before update on public.streaks
    for each row execute function public.touch_updated_at();

drop trigger if exists premium_touch on public.premium;
create trigger premium_touch before update on public.premium
    for each row execute function public.touch_updated_at();
