# Incipit — Setup backend v2

L'app tourne sans backend (mode V1 localStorage). Pour activer la sync cloud,
le premium Stripe et les notifications push, remplis les variables ci-dessous.

Tu peux câbler en ~30 min : Supabase (10 min), Stripe (10 min), VAPID (5 min).

## 0. Prérequis

- Compte GitHub avec le repo Incipit lié à Vercel
- Node 18+ en local pour générer les clés VAPID

## 1. Supabase (auth + DB)

1. Va sur <https://supabase.com/dashboard>, crée un projet gratuit. Note
   l'URL (`https://xxx.supabase.co`) et les clés dans **Settings → API**.
2. Dans le SQL editor, exécute le contenu de
   `supabase/migrations/0001_init.sql`. Ça crée toutes les tables, policies
   RLS, triggers et fonctions.
3. **Authentication → Email Templates → Magic Link** : personnalise si tu
   veux (sujet "Ton lien pour ouvrir Incipit", etc.).
4. **Authentication → URL Configuration** : ajoute
   `https://<ton-domaine>/auth/callback` comme Redirect URL.
5. Copie dans `.env.local` (et dans Vercel Project Settings → Environment
   Variables) :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

La `SERVICE_ROLE_KEY` ne doit **jamais** être exposée au navigateur : elle
est utilisée uniquement dans les routes `/api/stripe/webhook`, `/api/push/*`
et `/api/cron/*`.

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
`/api/cron/daily-push` envoie bien le header `Authorization: Bearer <CRON_SECRET>`
(configuration auto si le secret est défini, sinon manuel).

## 4. Vérification

```bash
npm run build
npm start
```

- Ouvre <http://localhost:3000/auth/login> → saisis ton email.
- Regarde ta boîte, clique sur le lien, tu dois atterrir sur la home
  connecté.
- Crée un favori sur /incipit-du-jour, refresh dans un autre navigateur
  connecté avec le même email → le favori doit apparaître.

## 5. Graceful fallback

Si une section n'est pas remplie :

- Pas de Supabase → localStorage only (comportement V1 — rien ne casse).
- Pas de Stripe → `/premium` affiche "bientôt dispo" sur le CTA checkout.
- Pas de VAPID → push serveur désactivé, le toggle UI reste visible pour
  les tests locaux.

C'est la règle d'or : **ajouter ≠ casser**. Tu peux activer feature par
feature.
