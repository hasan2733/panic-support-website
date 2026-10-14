# Panic Support Website

A private, personal web app for practicing CBT skills and calming techniques
for panic disorder — built to help its user grow **confidence in handling
anxiety**, not dependence on the app.

Responsive phone and desktop design, with day, night, and warm reading themes.

> **Safety note:** this app is a support tool. It is not medical advice, not a
> diagnosis, and not a replacement for professional treatment.

## Features

- **Auth** — email/password sign in, registration, logout, password reset (Firebase Authentication)
- **Dashboard** — greeting, "what do you need right now" cards, recovery metrics, one small step for today
- **Panic Mode** — calm full-screen overlay: personal coping card, animated 4s-in/6s-out breathing guide, interactive 5-4-3-2-1 grounding, post-episode logging
- **Thought Journal** — CBT thought records (situation → automatic thought → evidence → alternative → balanced response → next action), with edit/delete
- **Practice Studio** — 10 filterable techniques with timers + 3 guided audio meditations (with transcripts and persistent completion checkboxes)
- **Learning Library** — trusted resources (CCI workbooks, WHO guide, NHS guide) as structured in-page summaries with key takeaways and official-source links; book recommendations; notes, favorites, reading progress
- **Episode Tracker** — panic counter, symptom checklist, context, what happened afterwards, retrospective classification, recovery time, history with delete
- **Faith Corner** (optional, separate) — sourced Qur'anic passages including Ayatul Kursi, the 3 Quls, Al-Fatiha, Al-Asr, and Dua Yunus, with Arabic, English translations, and recitation audio; sourced Ism-e-Azam passages and duas; gratitude journal and personal notes. The app never generates religious texts.
- **AI Chat** — CBT-oriented reflection chat via the user's own OpenRouter API key (entered in Settings, stored only in the browser). Bounded system prompt: no diagnosis, no medical advice, no religious text generation.
- **Settings** — day/night/read themes, adjustable text size, API key management, safety plan, JSON export of all data, permanent delete-all, disclaimer

## Prerequisites

- Node.js 20.19+ (or 22.12+) and npm
- A Firebase project (free Spark plan is enough)

## Setup

```bash
npm install
cp .env.example .env   # optional — defaults already point at the bundled project
npm run dev            # start the dev server
```

Open the printed local URL (usually http://localhost:5173).

### Firebase console setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and
   select your project (default: `anotherpanicattack`).
2. **Authentication → Sign-in method** → enable **Email/Password**.
3. **Firestore Database** → Create database (start in production mode).
4. **Firestore Database → Rules** → paste the contents of `firestore.rules`
   in this repo and **Publish**. This locks every user to their own
   `users/{uid}/…` data tree.
5. If you use your own project, update the `VITE_FIREBASE_*` values in `.env`.

## Deploy

### Option A — Firebase Hosting (recommended)

```bash
npx firebase-tools login
npx firebase-tools use anotherpanicattack
npx firebase-tools init hosting
# Select the existing Firebase project, use "dist" as the public directory,
# and configure the site as a single-page app (rewrite all URLs to /index.html).
npm run build
npx firebase-tools deploy --only hosting
```

The first-time Hosting setup creates `firebase.json`. Also set up the Firestore
rules in the Firebase console (Firestore Database → Rules) by publishing the
checked-in `firestore.rules` file, or initialize Firestore with the CLI and
deploy the rules:

```bash
npx firebase-tools init firestore
# Point the rules file selection at firestore.rules.
npx firebase-tools deploy --only firestore:rules
```

In Firebase Console, enable **Authentication → Email/Password** and add your
production domain to **Authentication → Settings → Authorized domains**.
Deploy the Firestore rules before inviting users. Do not loosen the
per-user rule in `firestore.rules`.

### Option B — Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

Set the `VITE_FIREBASE_*` environment variables in the Vercel project settings
if you are not using the bundled Firebase project. Add the deployed domain to
Firebase Authentication's authorized domains and publish the checked-in
Firestore rules in the Firebase console.

### Deploy from a private GitHub repository

First create an empty **private** repository on GitHub (do not initialize it
with a README, license, or gitignore). From this project folder, initialize
Git, inspect the staged files, and push:

```bash
git init -b main
git add -A
git status --short
# Verify that no real .env files, credentials, or user exports are staged.
git commit -m "Initial Panic Support website"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Replace `USERNAME` and `REPOSITORY` with your GitHub account and repository
name. Sign in to GitHub when Git prompts you; do not put a personal access
token in the remote URL.

Then, in the Firebase console, connect that repository to Firebase Hosting
(Hosting → Get started → GitHub), select the production branch, and use
`npm ci` as the install command and `npm run build` as the build command. The
build output directory is `dist`. Set any required `VITE_FIREBASE_*` build
variables in the deployment provider's environment settings. Never add a real
`.env` file or an OpenRouter key to GitHub.

### Sync and publish later code changes

If Firebase Hosting is connected to your GitHub repository for automatic
deployments, commit and push your changes; Firebase will build and publish the
configured production branch:

```bash
git add -A
git commit -m "Describe the update"
git push
```

If you deploy manually with the Firebase CLI, pull the latest code first, then
build and deploy Hosting:

```bash
git pull
npm ci
npm run build
npx firebase-tools deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with the project serving your current site.
If Firebase Hosting has not been initialized in this checkout yet, run
`npx firebase-tools init hosting` once, choose the existing Firebase project,
use `dist` as the public directory, and enable the single-page app rewrite.
Only deploy Firestore rules when those rules have intentionally changed:
`npx firebase-tools deploy --only firestore:rules --project YOUR_FIREBASE_PROJECT_ID`.

## Privacy and repository visibility

Keep the repository private by default. The source includes a Firebase web
configuration for the existing project; Firebase web API keys are client-side
identifiers, not authentication secrets. Access to user data must be enforced
by Firebase Authentication and the deployed Firestore rules. The checked-in
rules restrict each signed-in user to their own `users/{uid}` subtree, but
verify that these exact rules are deployed before launch.

The `.gitignore` excludes local `.env` files, build output, dependencies, and
Firebase local state. Verify that no credentials, private exports, or user
records are staged before pushing. The app's account data is stored in
Firestore; keep your Firebase project secured and do not share exports.

Making the source public does not publish Firestore records by itself, but it
does make the code and its Firebase project identifiers visible to everyone.
Only consider a public repository after reviewing every tracked file and
commit, confirming no secrets or personal data are included, confirming your
Firestore rules and Firebase API-key restrictions, and deciding that you want
the faith, mental-health, and app implementation details to be public.

## Project structure

```
src/
  assets/audio/        # guided meditation audio (mp3)
  components/          # screens: Dashboard, PanicMode, ThoughtJournal, …
  context/             # Auth and appearance preferences
  data/                # techniques, meditations+transcripts, learning, faith content
  hooks/               # useCollection (live Firestore subscription)
  lib/                 # firebase.ts (init), db.ts (typed Firestore helpers)
  App.tsx              # tab navigation shell
  main.tsx             # entry point
  index.css            # Tailwind v4 theme and day/night/read modes
scripts/               # original meditation scripts (txt)
firestore.rules        # per-user locked-down security rules
```

## Data model (Firestore, all under `users/{uid}/`)

`thoughtRecords`, `episodes`, `reflections`, `practiceSessions`, `favorites`,
`faithNotes`, `chatMessages`, `plans`, `copingCards`.

## Notes for developers

- The Firebase web config in `src/lib/firebase.ts` is **public by design**
  (it ships in client JS). Protection comes from `firestore.rules`.
- The OpenRouter API key is **never** committed or sent to any server except
  `openrouter.ai` — it lives in the browser's localStorage.
- Religious content policy: only fixed, sourced passages and duas in
  `src/data/faith.ts` may appear; the AI chat is explicitly barred from
  generating religious text (see its system prompt in `AIChat.tsx`).
