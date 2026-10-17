# Panic Support Website

A personal mental-health support web app for managing panic symptoms, building calm habits, and practicing CBT-inspired coping strategies. The app is designed to help users feel more grounded, track patterns, and access short support tools whenever they need them.

> Safety note: This app is a support tool, not medical advice, not a diagnosis, and not a replacement for professional treatment.

## Live demo

- Demo: https://anotherpanicattack.web.app/

## Repository snapshot

This project is primarily a TypeScript app, with the following language composition:

- TypeScript: 96.3%
- CSS: 3.2%
- HTML: 0.5%

## Why this app exists

Panic Support Website is built around the idea that people managing panic and anxiety benefit from a small, accessible set of daily tools:

- calming exercises during a panic episode
- emotional reflection and journaling
- structured coping techniques
- progress tracking over time
- supportive, privacy-aware personal data management

## Features

- Email/password authentication with Firebase
- Dashboard with quick actions and daily support prompts
- Panic Mode with a calming full-screen experience, breathing guidance, grounding exercise, and post-episode logging
- Thought Journal for CBT-style reflection and tracking
- Practice Studio with guided techniques and meditations
- Learning Library with curated health and coping resources
- Episode Tracker for symptom history and recovery log
- Optional Faith Corner with verified, sourced religious passages and recitations
- AI-powered reflection chat using the user's own OpenRouter API key
- Settings for appearance, text size, safety plan, data export, and cleanup

## Tech stack

- React 19
- TypeScript
- Vite
- Firebase Authentication + Firestore
- Tailwind CSS

## Project structure

```text
src/
  assets/audio/        Guided meditation audio (verify licensing before public distribution)
  components/          Screens and UI components
  context/             Auth and appearance state
  data/                Techniques, meditations, learning content, faith references
  hooks/               Firestore subscription hooks
  lib/                 Firebase initialization and database helpers
  App.tsx              App shell and tab navigation
  main.tsx             Entry point
  index.css            Global styling and theme system
firestore.rules        Firestore access rules for per-user data
package.json
README.md
```

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Firebase project

## Local setup

```bash
npm install
cp .env.example .env   # optional; many defaults are already provided
npm run dev
```

Then open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Firebase setup

1. Create a Firebase project in the Firebase Console.
2. Enable Authentication → Email/Password.
3. Create a Firestore database.
4. Publish the rules from `firestore.rules`.
5. Add your production domain under Authentication → Settings → Authorized domains.
6. Configure environment variables if you are not using the bundled project defaults.

### Important security note

The Firebase web config in `src/lib/firebase.ts` is intentionally public by design because it is used in client-side JavaScript. Real protection comes from Firestore rules, not the API key itself.

The repository enforces a per-user data model under `users/{uid}/...`; this is locked down by `firestore.rules` and should be deployed before production use.

## Deployment

### Firebase Hosting (recommended)

```bash
npx firebase-tools login
npx firebase-tools use YOUR_FIREBASE_PROJECT_ID
npm run build
npx firebase-tools deploy --only hosting
```

If you have not initialized hosting yet, run:

```bash
npx firebase-tools init hosting
```

Use `dist` as the public directory and enable SPA rewrites if prompted.

### Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

Set `VITE_FIREBASE_*` environment variables in the Vercel project settings if you are not using the bundled Firebase project config.

## Privacy and data safety

- User data is stored in Firestore under `users/{uid}/...`.
- The checked-in rule file restricts access so each signed-in user only sees their own data.
- The AI chat uses the user's own OpenRouter API key, which is stored in the browser and not committed to git.
- Do not commit real `.env` files, JSON exports, or user data.
- Verify that no secrets or personal information remain in the git history before making the repository public.

## Security recommendations before public release

Before publishing this repository publicly, review the following:

- Remove or rotate any live Firebase config values you do not want exposed.
- Confirm your Firestore rules are deployed and correctly scoped to user data.
- Check for secrets in git history and working tree.
- Verify all included audio files, translations, and references have appropriate licensing or permissions.
- Add `SECURITY.md`, and issue templates for public collaboration.

## Notes for developers

- The app uses Firebase client SDKs for authentication and Firestore.
- The app is designed for a single-user experience with personal data separation.
- The optional Faith Corner uses fixed and verified religious content only; the AI chat is explicitly restricted from generating religious text.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Suggested next steps

- Add `SECURITY.md`
- Add `CONTRIBUTING.md`
- Add `CODE_OF_CONDUCT.md`
- Run a dependency security audit
- Add CI checks for lint and build
