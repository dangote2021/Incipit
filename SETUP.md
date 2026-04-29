# Incipit — Setup backend v2.1 (DB partagée Adventurer)

L'app tourne sans backend (mode V1 localStorage). Pour activer la sync cloud,
le premium Stripe et les notifications push, remplis les variables ci-dessous.

Tu peux câbler en ~20 min : Supabase (5 min, déjà migré), Stripe (10 min),
VAPID (5 min).

## Architecture multi-tenant

Incipit **partage la base Supabase d'Adventurer** (projet
`avldyvgvouzpeprygvyw`). Les tables Incipit sont préfixées `incipit_*` pour
rester isolées de l'existant Adventurer (`profiles`, `activities`, `spots`,
…). La table `auth.users` est partagée : un même user peut avoir un profil
Adventurer ET un profil Incipit (les deux sont créés à la demande, pas de
trigger automatique).

Cette stratégie est calquée sur la cohabitation Ravito ↔ K9.

## 0. Prérequis

- Accès au projet Supabase Adventurer (`avldyvgvouzpeprygvyw`)
- Compte GitHub avec le repo Incipit lié à Vercel
- Node 18+ en local pour générer les clés VAPID

## 1. Supabase (auth + DB) — déjà migré

La migration `supabase/migrations/0001_incipit_init.sql` a **déjà été
appliquée** sur le projet adventurer via Supabase MCP. Elle crée :

- 7 tables préfixées : `incipit_profiles`, `incipit_favorites`,
  `incipit_streaks`, `incipit_premium`, `incipit_push_subscriptions`,
  `incipit_telemetry_events`, `incipit_rate_limits`
- RLS activé partout, policies "self only" via `auth.uid() = user_id`
- RPC `public.upsert_incipit_streak` (pour ne pas collisionner avec
  `upsert_streak` côté Adventurer)
- Triggers `updated_at` réutilisant la fonction `public.touch_updated_at()`
  d'Adventurer si elle existe

Si tu as besoin de rejouer la migration (nouveau projet, branche dev) :
exécute le contenu du fichier dans le SQL Editor Supabase.

### Récupère les clés Adventurer

1. Va dans le projet adventurer Supabase → **Settings → API**.
2. Copie l'URL et les clés dans `.env.local` (et Vercel → Environment
   Variables) :

```
NEXT_PUBLIC_SUPABASE_URL=https://avldyvgvouzpeprygvyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

La `SERVICE_ROLE_KEY` ne doit **jamais** être exposée au navigateur : elle
est utilisée uniquement dans les routes `/api/stripe/webhook`, `/api/push/*`,
`/api/cron/*` et `/api/telemetry/*`.

### Auth — magic link

1. **Authentication → Email Templates → Magic Link** : personnalise le sujet
   ("Ton lien pour ouvrir Incipit") et le body si tu veux.
2. **Authentication → URL Configuration** : ajoute
   `https://<ton-domaine-incipit>/auth/callback` comme Redirect URL (en plus
   de celles d'Adventurer déjà présentes).

## 2. Stripe (Premium)

1. <https://dashboard.stripe.com/apikeys> → note la clé secrète (`sk_live_*`
   pour la prod, `sk_test_*` pour dev).
2. Crée un Product "Incipit Premium" → Price récurrent mensuel (ex. 4,99 €).
   Note l'ID `price_XXX`.
3. Webhooks → Add endpoint :
   `https://<ton-domaine>/api/stripe/webhook`
   Événements à écouter :
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
   Note le signing secret (`whsec_*`).
4. Variables :

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_XXX
NEXT_PUBLIC_SITE_URL=https://incipit.vercel.app
```

> Les abonnements Incipit sont stockés dans `incipit_premium` — totalement
> indépendants des activités/spots/profils Adventurer.

## 3. Web Push (notifications quotidiennes)

1. Génère une paire de clés VAPID :

   ```bash
   npx web-push generate-vapid-keys
   ```

2. Copie la paire :

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@incipit.app
```

3. Le cron Vercel est déjà configuré dans `vercel.json` (tous les jours 7h).
   Ajoute un secret partagé :

```
CRON_SECRET=<openssl rand -base64 32>
```

Dans Vercel, va dans **Settings → Cron Jobs** et assure-toi que le cron
`/api/cron/daily-push` envoie bien le header
`Authorization: Bearer <CRON_SECRET>` (configuration auto si le secret est
défini, sinon manuel).

## 4. Vérification

```bash
npm run build
npm start
```

- Ouvre <http://localhost:3000/auth/login> → saisis ton email.
- Regarde ta boîte, clique sur le lien, tu dois atterrir sur la home
  connecté.
- Crée un favori sur `/incipit-du-jour`, refresh dans un autre navigateur
  connecté avec le même email → le favori doit apparaître.
- Vérifie côté Supabase qu'une ligne est apparue dans `incipit_profiles`
  et `incipit_favorites` (pas dans `profiles` côté Adventurer !).

## 5. Graceful fallback

Si une section n'est pas remplie :

- Pas de Supabase → localStorage only (comportement V1 — rien ne casse).
- Pas de Stripe → `/premium` affiche "bientôt dispo" sur le CTA checkout.
- Pas de VAPID → push serveur désactivé, le toggle UI reste visible pour
  les tests locaux.

C'est la règle d'or : **ajouter ≠ casser**. Tu peux activer feature par
feature.

## 6. Cohabitation avec Adventurer — règles d'or

- **Toujours** préfixer les tables Incipit avec `incipit_`. Jamais toucher
  à `profiles`, `activities`, `spots`, etc.
- Les RPC Incipit sont préfixées aussi (`upsert_incipit_streak`).
- Les triggers réutilisent `public.touch_updated_at()` (créée par
  Adventurer en premier, sinon par Incipit).
- L'app Incipit ne lit **jamais** les tables Adventurer, et vice-versa.
- Si tu ajoutes une migration Incipit, range-la dans
  `supabase/migrations/000X_incipit_*.sql` et applique-la via Supabase MCP
  ou le SQL editor.
