/**
 * Practice studio — 10 filterable techniques with timers, plus 3 guided
 * audio meditations with transcripts and persistent completion checkboxes.
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
import { IconLeaf } from './icons';

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

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? TECHNIQUES
        : TECHNIQUES.filter((t) => t.category === filter),
    [filter],
  );

  const completedMeditations = useMemo(
    () =>
      new Set(
        sessions
          .filter((s) => s.kind === 'meditation')
          .map((s) => s.techniqueId),
      ),
    [sessions],
  );

  const logTechnique = async (techniqueId: string, minutes: number) => {
    if (!uid) return;
    await addItem(uid, 'practiceSessions', {
      techniqueId,
      kind: 'technique',
      minutes,
    });
  };

  const toggleMeditation = async (techniqueId: string, done: boolean) => {
    if (!uid) return;
    // Checking the box records a completed session in Firestore (persistent).
    if (done) {
      await addItem(uid, 'practiceSessions', {
        techniqueId,
        kind: 'meditation',
      });
    }
    // Unchecking intentionally does not delete history — the practice happened.
  };

  return (
    <Screen>
      <PageHeader
        kicker="Skills"
        title="Practice studio"
        sub="Pick a technique, set the timer, and practice. There is no perfect way to do this."
      />

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
        {filtered.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-2">
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
            <button
              className="text-sm text-glow-300 mt-2"
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
            <Timer
              minutes={t.minutes}
              onComplete={() => logTechnique(t.id, t.minutes)}
            />
          </Card>
        ))}
      </div>

      <SectionTitle sub="Listen along, then tick the box. Completions are saved.">
        Guided meditations
      </SectionTitle>
      <div className="space-y-3">
        {MEDITATIONS.map((m) => {
          const done = completedMeditations.has(m.id);
          return (
            <Card key={m.id} className={done ? 'border-glow-500/40' : ''}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold text-mist-100">{m.title}</h3>
                  <p className="text-xs text-mist-600">{m.minutes} minutes</p>
                </div>
                {done && (
                  <span className="text-xs text-glow-300 bg-glow-500/15 border border-glow-400/30 rounded-full px-2.5 py-1">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-mist-500 mb-3 leading-relaxed">
                {m.description}
              </p>
              <audio controls preload="none" src={m.audioSrc} className="w-full mb-3" />
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
              <label className="flex items-center gap-2.5 text-sm text-mist-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(e) => toggleMeditation(m.id, e.target.checked)}
                />
                Mark as completed
              </label>
            </Card>
          );
        })}
      </div>

      <SafetyNote />
    </Screen>
  );
}
