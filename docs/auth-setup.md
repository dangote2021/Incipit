# Setup auth Incipit — emails FR + Google OAuth

Ce document liste les étapes manuelles à faire UNE FOIS dans le dashboard
Supabase et Google Cloud pour activer (a) les emails Auth en français et
(b) la connexion "Continuer avec Google".

Le code applicatif est déjà en place — il ne reste plus que la config
côté tableaux de bord externes.

---

## A. Emails Supabase Auth en français

Les 4 templates sont dans `supabase/templates/*.html` :

- `magic-link.html` — lien magique de connexion (le seul utilisé activement
  par Incipit en production aujourd'hui)
- `confirm-signup.html` — confirmation d'inscription
- `recovery.html` — récupération de compte
- `change-email.html` — changement d'adresse email

### Étapes (1 fois)

1. Va sur https://supabase.com/dashboard/project/avldyvgvouzpeprygvyw
2. Menu de gauche : **Authentication** → **Email Templates**
3. Pour chaque template :
   - Clique le template (Magic Link, Confirm signup, Reset Password,
     Change Email Address)
   - Dans le champ **Subject heading**, mets le sujet FR (cf. ci-dessous)
   - Dans le champ **Message body (HTML)**, colle le contenu du fichier
     correspondant dans `supabase/templates/`
   - Clique **Save**

### Sujets à utiliser

| Template Supabase     | Subject FR                                       | Fichier                  |
| --------------------- | ------------------------------------------------ | ------------------------ |
| Magic Link            | `Ton lien de connexion à Incipit`                | `magic-link.html`        |
| Confirm signup        | `Confirme ton inscription à Incipit`             | `confirm-signup.html`    |
| Reset Password        | `Reprends l'accès à ton compte Incipit`          | `recovery.html`          |
| Change Email Address  | `Confirme ta nouvelle adresse email Incipit`     | `change-email.html`      |

### Variables disponibles

Les templates utilisent les variables Supabase standard :

- `{{ .ConfirmationURL }}` — URL de validation (magic, confirm, recovery, change)
- `{{ .NewEmail }}` — nouvelle adresse (uniquement pour change-email)
- `{{ .Email }}` — email du destinataire
- `{{ .Token }}` — token OTP 6 chiffres (non utilisé, on est sur le flow URL)
- `{{ .SiteURL }}` — URL du site, utile en fallback

### Locale par défaut

Pour que l'expéditeur affiche aussi en français côté From, vérifier
**Authentication** → **Settings** → **SMTP Settings** que le sender name
est `Incipit` (et non `Supabase Auth`).

---

## B. Google OAuth — "Continuer avec Google" sur /auth/login

Le bouton est déjà dans `app/auth/login/page.tsx`. Il appelle
`supabase.auth.signInWithOAuth({ provider: 'google' })` qui redirige
l'utilisateur vers Google, puis Google redirige vers
`https://<projet>.supabase.co/auth/v1/callback`, et Supabase finalement
vers `/auth/callback?code=…` côté Incipit. Notre callback existant
échange le code et pose les cookies de session.

### Étapes (1 fois) — Google Cloud Console

1. Va sur https://console.cloud.google.com/apis/credentials
2. Crée (ou réutilise) un projet `Incipit`
3. **APIs & Services** → **OAuth consent screen** :
   - User type : **External**
   - App name : `Incipit`
   - User support email : guillaumecoulon1@gmail.com
   - Developer contact : guillaumecoulon1@gmail.com
   - Logo : facultatif (cf. `public/logo-square.svg` quand on l'aura ajouté)
   - Domaines autorisés : `incipit-navy.vercel.app` (et `supabase.co`)
   - Scopes : juste `email`, `profile`, `openid` (les défauts)
   - Test users : ton email tant que l'app n'est pas en production review
   - **Save**
4. **APIs & Services** → **Credentials** → **Create Credentials** →
   **OAuth client ID**
   - Application type : **Web application**
   - Name : `Incipit Supabase Auth`
   - **Authorized JavaScript origins** :
     - `https://avldyvgvouzpeprygvyw.supabase.co`
     - `https://incipit-navy.vercel.app`
     - `http://localhost:3000` (pour le dev)
   - **Authorized redirect URIs** :
     - `https://avldyvgvouzpeprygvyw.supabase.co/auth/v1/callback`
   - **Create**
5. Copie le **Client ID** et le **Client secret** affichés

### Étapes (1 fois) — Supabase Dashboard

1. Va sur https://supabase.com/dashboard/project/avldyvgvouzpeprygvyw
2. Menu : **Authentication** → **Providers** → **Google**
3. Toggle **Enable Sign in with Google** : ON
4. Colle le **Client ID** et le **Client Secret** récupérés ci-dessus
5. **Authorized Client IDs** : laisse vide (sauf si tu fais aussi du
   sign-in natif iOS/Android, à voir plus tard avec Capacitor)
6. **Save**

### Étapes — URL de redirection sur Supabase

1. Toujours dans le dashboard Supabase
2. **Authentication** → **URL Configuration**
3. **Site URL** : `https://incipit-navy.vercel.app`
4. **Redirect URLs** (allow-list) — ajoute toutes ces lignes :
   - `https://incipit-navy.vercel.app/**`
   - `https://incipit-navy.vercel.app/auth/callback`
   - `http://localhost:3000/**` (dev)
   - Tout autre alias Vercel utilisé pour les previews

### Test

1. Va sur https://incipit-navy.vercel.app/auth/login
2. Clique **Continuer avec Google**
3. Tu dois voir l'écran de consentement Google → choisir un compte → être
   redirigé sur la home connecté (vérifier dans **Profil** que ton email
   apparaît)

Si le bouton renvoie une erreur "redirect_uri_mismatch", c'est que
l'URL de Supabase (`https://<ref>.supabase.co/auth/v1/callback`) n'est
pas dans les Authorized redirect URIs côté Google Cloud — re-vérifier
l'étape 4 du Google Cloud Console.

---

## Notes — pourquoi on ne peut pas automatiser

Les deux configs ci-dessus ne sont pas exposées par l'API Management
Supabase de manière scriptable :

- Les email templates sont éditables via l'API mais pas dans le scope
  des MCP utilisés par Cowork. Pour les automatiser, il faudrait passer
  par l'API Management directe avec un Personal Access Token Supabase.
- Le provider Google nécessite la création d'un OAuth client côté
  Google Cloud — étape humaine obligatoire (le secret ne peut pas
  être généré par tiers).

Donc ces ~10 minutes de copier-coller dans deux dashboards sont le prix
à payer une seule fois. Une fois faites, plus jamais besoin d'y revenir.
