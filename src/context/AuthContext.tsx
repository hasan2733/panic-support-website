/**
 * Authentication state for the whole app.
 * Wraps Firebase Auth (email/password) and exposes friendly error messages.
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Turn a Firebase Auth error code into a calm, human-readable message. */
export function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address does not look right. Please check it and try again.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'No account found with those details. Check your email and password, or create a new account.';
    case 'auth/wrong-password':
      return 'The password is not correct. Try again or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Please choose a password with at least 6 characters.';
    case 'auth/network-request-failed':
      return 'The app could not reach the login service. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little while and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled for this project yet. Enable it in the Firebase console under Authentication → Sign-in method.';
    default:
      return 'Something went wrong signing you in. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep the React state in sync with Firebase's persisted session.
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const wrap = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
    } catch (e: unknown) {
      const code =
        typeof e === 'object' && e !== null && 'code' in e
          ? String((e as { code: unknown }).code)
          : '';
      throw new Error(friendlyAuthError(code));
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUp: (email, password) =>
      wrap(() => createUserWithEmailAndPassword(auth, email, password)),
    signIn: (email, password) =>
      wrap(() => signInWithEmailAndPassword(auth, email, password)),
    logOut: () => wrap(() => signOut(auth)),
    resetPassword: (email) => wrap(() => sendPasswordResetEmail(auth, email)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
