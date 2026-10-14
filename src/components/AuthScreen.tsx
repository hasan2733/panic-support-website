/**
 * Entry screen for logged-out users: sign in, create account, reset password.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Field, LogoMark, PrimaryButton, SafetyNote } from './ui';

type Mode = 'signin' | 'signup' | 'reset';

export default function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'signin') await signIn(email.trim(), password);
      else if (mode === 'signup') await signUp(email.trim(), password);
      else {
        await resetPassword(email.trim());
        setInfo('Password reset email sent. Check your inbox.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, string> = {
    signin: 'Welcome back',
    signup: 'Create your space',
    reset: 'Reset your password',
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm rise-in">
        <div className="text-center mb-9">
          <div className="flex justify-center mb-5">
            <LogoMark size="lg" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-glow-400/80 mb-2 font-medium">
            Private · Calm · Yours
          </p>
          <h1 className="font-display text-3xl text-mist-50 font-medium">
            Panic Support
          </h1>
          <p className="text-mist-500 mt-3 text-sm leading-relaxed">
            A quiet place to practice calm, understand panic, and grow
            confidence — one small step at a time.
          </p>
        </div>

        <Card className="bg-glow-500/5">
          <h2 className="font-display text-xl text-mist-50 mb-5">{titles[mode]}</h2>
          <form onSubmit={submit}>
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
            {mode !== 'reset' && (
              <Field label="Password" hint={mode === 'signup' ? 'At least 6 characters.' : undefined}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </Field>
            )}
            {error && (
              <p className="text-sm text-rosesoft-300 bg-rosesoft-300/10 border border-rosesoft-300/25 rounded-2xl px-3.5 py-2.5 mb-3">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-glow-300 bg-glow-500/10 border border-glow-500/25 rounded-2xl px-3.5 py-2.5 mb-3">
                {info}
              </p>
            )}
            <PrimaryButton type="submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign in'
                  : mode === 'signup'
                    ? 'Create account'
                    : 'Send reset email'}
            </PrimaryButton>
          </form>

          <div className="mt-5 text-center text-sm space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  className="text-glow-300 block w-full"
                  onClick={() => setMode('signup')}
                >
                  New here? Create an account
                </button>
                <button
                  className="text-mist-500 hover:text-mist-300 block w-full"
                  onClick={() => setMode('reset')}
                >
                  Forgot your password?
                </button>
              </>
            )}
            {mode !== 'signin' && (
              <button
                className="text-glow-300 block w-full"
                onClick={() => setMode('signin')}
              >
                Back to sign in
              </button>
            )}
          </div>
        </Card>

        <SafetyNote />
      </div>
    </div>
  );
}
