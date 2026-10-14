/**
 * Firebase initialization.
 *
 * The web config below is PUBLIC BY DESIGN — it ships inside the
 * client-side JavaScript of every Firebase web app. Real protection comes
 * from the Firestore security rules (see firestore.rules at the repo root),
 * which only let a signed-in user read/write their own data tree.
 *
 * Every value can be overridden with a VITE_FIREBASE_* environment variable
 * (see .env.example), e.g. to point the app at a different project.
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyCjfwUoRgwz_VZVbkbCC_fOyafHWi4FEcI',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'anotherpanicattack.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anotherpanicattack',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'anotherpanicattack.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '299227980351',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:299227980351:web:e7a28a58dc9929594f8e8a',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-JSZ352MQMR',
};

const app = initializeApp(firebaseConfig);

/** Firebase Authentication (email/password). */
export const auth = getAuth(app);

/** Cloud Firestore database. */
export const db = getFirestore(app);
