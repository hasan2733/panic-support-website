/**
 * Practice studio — techniques with timers and spoken guidance, plus
 * recorded meditations. Every completed session is counted by local date.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem } from '../lib/db';
import type { PracticeSession } from '../types';
import { MEDITATIONS } from '../data/meditations';
import {
  TECHNIQUES,
  TECHNIQUE_CATEGORIES,
  type TechniqueCategory,
} from '../data/techniques';
import { Card, Chip, EmptyState, PageHeader, SafetyNote, Screen, SectionTitle } from './ui';
import { IconLeaf, IconHeadphones } from './icons';

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sessionDay(session: PracticeSession) {
  return session.practicedOn?.slice(0, 10) ?? dayKey(new Date(session.createdAt));
}

function AudioGuidance({ title, steps }: { title: string; steps: string[] }) {
  const [playing, setPlaying] = useState(false);
  const available = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const play = () => {
    if (!available) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      `${title}. ${steps.map((step, index) => `Step ${index + 1}. ${step}`).join(' ')}`,
    );
    speech.onend = () => setPlaying(false);
    speech.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="mt-3 flex items-center gap-3">
      <button
        type="button"
        onClick={playing ? () => {
          window.speechSynthesis.cancel();
          setPlaying(false);
        } : play}
        disabled={!available}
        className="inline-flex items-center gap-2 rounded-full border border-glow-400/30 bg-glow-500/10 px-3.5 py-2 text-sm font-medium text-glow-300 hover:bg-glow-500/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconHeadphones className="h-4 w-4" />
        {playing ? 'Stop audio guidance' : 'Listen to audio guidance'}
      </button>
      {!available && <span className="text-xs text-mist-600">Audio guidance is not supported in this browser.</span>}
    </div>
  );
}

/** Simple countdown timer. On completion it logs a practice session. */
function Timer({
  minutes,
  onComplete,
}: {
  minutes: number;
  onComplete: () => void;
}) {
  const total = minutes * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // One tick per second while running; completion fires exactly once.
  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      setDone(true);
      onCompleteRef.current();
      return;
    }
    const id = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, left]);

  const start = () => {
    setDone(false);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setLeft(total);
    setDone(false);
  };

  const mm = Math.floor(left / 60).toString().padStart(2, '0');
  const ss = (left % 60).toString().padStart(2, '0');
  const pct = Math.round((left / total) * 100);

  return (
    <div className="mt-4 p-3.5 rounded-2xl bg-night-950/50 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-2xl text-glow-300">
          {mm}:{ss}
        </span>
        <span className="text-xs text-mist-600">{minutes} min timer</span>
      </div>
      <div className="h-1.5 rounded-full bg-night-600 mb-3 overflow-hidden">
        <div
          className="h-full bg-glow-400 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button
            onClick={start}
            disabled={done && left === 0}
            className="flex-1 rounded-xl bg-glow-500/15 border border-glow-400/30 text-glow-300 text-sm font-medium py-2 disabled:opacity-40"
          >
            {done ? 'Done ✓' : left < total ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex-1 rounded-xl border border-white/10 text-mist-300 text-sm font-medium py-2"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-xl border border-white/10 text-mist-500 text-sm px-4 py-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function PracticeStudio() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items: sessions } = useCollection<PracticeSession>(
    uid,
    'practiceSessions',
  );

  const [filter, setFilter] = useState<TechniqueCategory | 'all'>('all');
  const [openSteps, setOpenSteps] = useState<string | null>(null);
  const [trackingError, setTrackingError] = useState('');

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? TECHNIQUES
        : TECHNIQUES.filter((t) => t.category === filter),
    [filter],
  );

  // Sessions grouped by technique for tracking
  const sessionsByTechnique = useMemo(() => {
    const grouped: Record<string, PracticeSession[]> = {};
    sessions.forEach((s) => {
      if (!grouped[s.techniqueId]) grouped[s.techniqueId] = [];
      grouped[s.techniqueId].push(s);
    });
    return grouped;
  }, [sessions]);

  const todayKey = dayKey(new Date());

  const savePractice = async (
    techniqueId: string,
    kind: PracticeSession['kind'],
    minutes: number,
  ) => {
    if (!uid) return;
    setTrackingError('');
    try {
      await addItem(uid, 'practiceSessions', {
        techniqueId,
        kind,
        minutes,
        practicedOn: dayKey(new Date()),
      });
    } catch (error) {
      setTrackingError(
        error instanceof Error
          ? `Could not save this practice: ${error.message}`
          : 'Could not save this practice. Please check your connection and try again.',
      );
    }
  };

  // Count how many times a technique was practiced today
  const countToday = (techniqueId: string): number => {
    return (sessionsByTechnique[techniqueId] ?? [])
      .filter((session) => sessionDay(session) === todayKey).length;
  };

  // Count how many times a technique was practiced overall
  const countTotal = (techniqueId: string): number => {
    return (sessionsByTechnique[techniqueId] ?? []).length;
  };

  // Get dates practiced for a technique
  const practiceDates = (techniqueId: string): string[] => {
    return [
      ...new Set(
        (sessionsByTechnique[techniqueId] ?? []).map(sessionDay),
      ),
    ].sort((a, b) => b.localeCompare(a));
  };

  const recentPracticeCounts = (techniqueId: string) => {
    const counts = new Map<string, number>();
    (sessionsByTechnique[techniqueId] ?? []).forEach((session) => {
      const date = sessionDay(session);
      counts.set(date, (counts.get(date) ?? 0) + 1);
    });
    return [...counts.entries()].sort(([a], [b]) => b.localeCompare(a)).slice(0, 7);
  };

  return (
    <Screen>
      <PageHeader
        kicker="Skills"
        title="Practice studio"
        sub="Listen to guided instructions, practice at your pace, and see how many times you practiced today and on each recent day."
      />
      {trackingError && (
        <p role="alert" className="mb-4 rounded-2xl border border-rosesoft-300/25 bg-rosesoft-300/10 p-3 text-sm text-rosesoft-300">
          {trackingError}
        </p>
      )}

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
        {TECHNIQUE_CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <EmptyState icon={<IconLeaf className="w-5 h-5" />} title="Nothing here" body="Try another category." />
        </Card>
      )}

      <div className="space-y-3 mb-10">
        {filtered.map((t) => {
          const todayCount = countToday(t.id);
          const totalCount = countTotal(t.id);
          const dates = practiceDates(t.id);
          const history = recentPracticeCounts(t.id);

          return (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-mist-100">{t.name}</h3>
                  <p className="text-sm text-mist-500 mt-1 leading-relaxed">
                    {t.short}
                  </p>
                </div>
                <span className="text-[11px] text-mist-500 bg-night-900/80 border border-white/5 rounded-full px-2.5 py-1 whitespace-nowrap">
                  {t.category}
                </span>
              </div>

              {/* Tracking info */}
              <div className="flex items-center justify-between gap-3 mb-2 text-xs text-mist-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-glow-400/30" />
                  Practiced today: {todayCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-mist-300/15" />
                  Total: {totalCount}
                </span>
                {dates.length > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-mist-300/15" />
                    Last: {dates[0]}
                  </span>
                )}
              </div>

              <button
                className="text-sm text-glow-300 mt-1"
                onClick={() => setOpenSteps(openSteps === t.id ? null : t.id)}
              >
                {openSteps === t.id ? 'Hide steps' : 'Show steps'}
              </button>
              {openSteps === t.id && (
                <ol className="mt-2 space-y-1.5 text-sm text-mist-300 list-decimal list-inside">
                  {t.steps.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              )}
              <AudioGuidance title={t.name} steps={t.steps} />
              {history.length > 0 && (
                <div className="mt-3 rounded-2xl border border-white/5 bg-night-950/40 p-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-500">Recent practice days</p>
                  <ul className="flex flex-wrap gap-2">
                    {history.map(([date, count]) => (
                      <li key={date} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-mist-300">
                        {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {count} {count === 1 ? 'time' : 'times'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Timer
                minutes={t.minutes}
                onComplete={() => savePractice(t.id, 'technique', t.minutes)}
              />
            </Card>
          );
        })}
      </div>

      <SectionTitle sub="Listen to a guided meditation. Each time you finish, its date and session count are saved.">
        Guided meditations
      </SectionTitle>
      <div className="space-y-3">
        {MEDITATIONS.map((m) => {
          const todayCount = countToday(m.id);
          const totalCount = countTotal(m.id);
          const history = recentPracticeCounts(m.id);

          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold text-mist-100">{m.title}</h3>
                  <p className="text-xs text-mist-600">{m.minutes} minutes</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2 text-xs text-mist-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-glow-400/30" />
                  Practiced today: {todayCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-mist-300/15" />
                  Total: {totalCount}
                </span>
              </div>
              <p className="text-sm text-mist-500 mb-3 leading-relaxed">
                {m.description}
              </p>
              <audio
                controls
                preload="none"
                src={m.audioSrc}
                className="mb-3 w-full"
                onEnded={() => savePractice(m.id, 'meditation', m.minutes)}
              />
              <details className="mb-3">
                <summary className="text-sm text-glow-300">
                  Read the transcript
                </summary>
                <div className="mt-2 space-y-2 text-sm text-mist-300 leading-relaxed max-h-64 overflow-y-auto pr-1">
                  {m.transcript.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </details>
              <button
                type="button"
                onClick={() => savePractice(m.id, 'meditation', m.minutes)}
                className="rounded-full border border-glow-400/30 bg-glow-500/10 px-3.5 py-2 text-sm font-medium text-glow-300 hover:bg-glow-500/15"
              >
                Record another practice
              </button>
              {history.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {history.map(([date, count]) => (
                    <span key={date} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-mist-300">
                      {new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {count} {count === 1 ? 'time' : 'times'}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SafetyNote />
    </Screen>
  );
}
