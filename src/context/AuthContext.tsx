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
  updateProfile,
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
  authError: string | null;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [, setProfileVersion] = useState(0);

  useEffect(() => {
    let initialized = false;
    const timeout = window.setTimeout(() => {
      if (!initialized) {
        setAuthError(
          'Sign-in is taking longer than expected. Check your connection, then reload the app and try again.',
        );
        setLoading(false);
      }
    }, 10_000);

    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        initialized = true;
        window.clearTimeout(timeout);
        setUser(u);
        setAuthError(null);
        setLoading(false);
      },
      (error) => {
        initialized = true;
        window.clearTimeout(timeout);
        console.error('Firebase auth state initialization failed.', error);
        setAuthError(
          'Unable to check your sign-in status. Check your connection and reload the app.',
        );
        setLoading(false);
      },
    );

    return () => {
      window.clearTimeout(timeout);
      unsub();
    };
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
    authError,
    signUp: (email, password, nickname) =>
      wrap(async () => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: nickname.trim() });
        setUser(auth.currentUser);
        setProfileVersion((version) => version + 1);
        return userCredential;
      }),
    signIn: (email, password) =>
      wrap(() => signInWithEmailAndPassword(auth, email, password)),
    logOut: () => wrap(() => signOut(auth)),
    resetPassword: (email) => wrap(() => sendPasswordResetEmail(auth, email)),
    updateNickname: (nickname) =>
      wrap(async () => {
        if (user) {
          await updateProfile(user, { displayName: nickname.trim() });
          await user.reload();
          setAuthError(null);
          setUser(auth.currentUser);
          setProfileVersion((version) => version + 1);
        }
      }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
