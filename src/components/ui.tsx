/**
 * Shared presentational pieces. Quiet cards, soft type, large touch targets.
 */
import type { ReactNode } from 'react';

export function Screen({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto max-w-6xl px-5 pt-8 sm:px-8 lg:px-10 lg:pt-28 tabbar-pad ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  sub,
  action,
}: {
  kicker?: string;
  title: ReactNode;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-7 rise-in">
      {kicker && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-glow-400/80 mb-2 font-medium">
          {kicker}
        </p>
      )}
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-[1.85rem] sm:text-[2rem] leading-[1.15] text-mist-50 font-medium">
          {title}
        </h1>
        {action}
      </div>
      {sub && (
        <p className="text-sm text-mist-500 mt-2.5 leading-relaxed max-w-[36ch]">
          {sub}
        </p>
      )}
    </header>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-night-800/45 border border-white/5 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  sub,
}: {
  children: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-medium text-mist-50">{children}</h2>
      {sub && <p className="text-sm text-mist-500 mt-1 leading-relaxed">{sub}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl bg-glow-400 disabled:opacity-45 disabled:cursor-not-allowed text-night-950 font-semibold px-4 py-3.5 w-full hover:bg-glow-300 active:scale-[0.99] transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
  danger = false,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-medium w-full active:scale-[0.99] ${
        danger
          ? 'border-rosesoft-300/30 text-rosesoft-300 hover:bg-rosesoft-300/10'
          : 'border-white/10 text-mist-300 hover:bg-white/5 hover:text-mist-100'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-mist-300 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-mist-600 mt-1.5 leading-relaxed">{hint}</span>}
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium border whitespace-nowrap ${
        active
          ? 'bg-glow-400/15 border-glow-400/40 text-glow-300'
          : 'bg-night-900/40 border-white/10 text-mist-500 hover:text-mist-300 hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center py-10 px-4">
      <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-glow-500/10 border border-glow-400/20 text-glow-300 flex items-center justify-center text-xl">
        {icon}
      </div>
      <h3 className="font-display text-lg text-mist-50 mb-1.5">{title}</h3>
      <p className="text-sm text-mist-500 leading-relaxed">{body}</p>
    </div>
  );
}

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`text-mist-600 leading-relaxed ${
        compact ? 'text-xs mt-4' : 'text-xs mt-8'
      }`}
    >
      This app is a personal support tool — not medical advice and not a
      replacement for professional treatment. If you notice new or severe
      physical symptoms, seek urgent medical evaluation rather than assuming
      they are anxiety.
    </p>
  );
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function Spinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-2',
  };
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-3xl bg-night-800/45 p-5 space-y-3">
      <div className="h-4 bg-night-700/80 rounded-full w-2/3 animate-pulse" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-night-700/60 rounded-full animate-pulse" />
      ))}
    </div>
  );
}

export function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-9 h-9' : 'w-12 h-12';
  const ring = size === 'lg' ? 'w-9 h-9' : size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  return (
    <div
      className={`${box} rounded-full bg-glow-500/10 border border-glow-400/25 grid place-items-center`}
    >
      <div
        className={`${ring} rounded-full border-2 border-glow-400/70 breathe-ring`}
      />
    </div>
  );
}
