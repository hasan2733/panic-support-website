/**
 * Home dashboard: greeting, "what do you need right now" cards,
 * simple recovery metrics, and one small step for today.
 */
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import type { Episode, PracticeSession, TabId, ThoughtRecord } from '../types';
import { addItem } from '../lib/db';
import { Card, PageHeader, SafetyNote, Screen, SectionTitle } from './ui';
import {
  IconBook,
  IconCheck,
  IconHelp,
  IconJournal,
  IconLeaf,
} from './icons';
import type { ComponentType } from 'react';

const SMALL_STEPS = [
  'Step outside for 5 minutes and notice three sounds.',
  'Write down one worry, then close the notebook.',
  'Do one 4–6 breathing round (in 4, out 6).',
  'Text one person you trust, just to say hello.',
  'Tidy one small surface — a little order calms the mind.',
  'Drink a full glass of water, slowly and mindfully.',
  'Take a 10-minute walk without headphones.',
  'Name one thing you are grateful for, out loud.',
];

/** Count consecutive days (ending today) present in a set of YYYY-MM-DD strings. */
function streakOf(days: Set<string>): number {
  let streak = 0;
  const d = new Date();
  const todayKey = d.toISOString().slice(0, 10);
  if (!days.has(todayKey)) d.setDate(d.getDate() - 1);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function Dashboard({
  onTab,
  onPanic,
}: {
  onTab: (t: TabId) => void;
  onPanic: () => void;
}) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items: sessions } = useCollection<PracticeSession>(uid, 'practiceSessions');
  const { items: records } = useCollection<ThoughtRecord>(uid, 'thoughtRecords');
  const { items: episodes } = useCollection<Episode>(uid, 'episodes');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  const stepIndex = useMemo(() => {
    const dayNum = Math.floor(Date.now() / 86400000);
    return dayNum % SMALL_STEPS.length;
  }, []);
  const smallStep = SMALL_STEPS[stepIndex];

  const metrics = useMemo(() => {
    const days = new Set<string>();
    const push = (ts?: number) => {
      if (ts) days.add(new Date(ts).toISOString().slice(0, 10));
    };
    sessions.forEach((s) => push(s.createdAt));
    records.forEach((r) => push(r.createdAt));
    episodes.forEach((e) => push(e.createdAt));
    return {
      practices: sessions.length,
      journaled: records.length,
      logged: episodes.length,
      streak: streakOf(days),
    };
  }, [sessions, records, episodes]);

  const markStepDone = async () => {
    if (!uid) return;
    await addItem(uid, 'practiceSessions', {
      techniqueId: 'small-step',
      kind: 'small-step',
    });
  };

  const needCards: {
    title: string;
    body: string;
    Icon: ComponentType<{ className?: string }>;
    action: () => void;
  }[] = [
    {
      title: "I'm feeling anxious",
      body: 'Open a short, guided coping space.',
      Icon: IconHelp,
      action: onPanic,
    },
    {
      title: 'Understand my thoughts',
      body: 'Work through a CBT thought record.',
      Icon: IconJournal,
      action: () => onTab('journal'),
    },
    {
      title: 'Practice a skill',
      body: 'Breathing, grounding, relaxation.',
      Icon: IconLeaf,
      action: () => onTab('practice'),
    },
    {
      title: 'Learn',
      body: 'CBT resources, books, key ideas.',
      Icon: IconBook,
      action: () => onTab('learn'),
    },
  ];

  const metricCards = [
    { label: 'Practices', value: metrics.practices },
    { label: 'Logged', value: metrics.logged },
    { label: 'Day streak', value: metrics.streak },
  ];

  return (
    <Screen>
      <PageHeader
        kicker={greeting}
        title={displayName}
        sub="Progress here means growing confidence and doing more of what matters — not chasing zero anxiety."
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <section>
          <SectionTitle sub="Choose what fits this moment.">What do you need?</SectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {needCards.map((c) => (
              <button
                key={c.title}
                onClick={c.action}
                className="group min-h-36 rounded-3xl border border-night-700/70 bg-night-900/75 p-5 text-left shadow-[0_8px_24px_rgba(36,56,43,0.04)] hover:-translate-y-0.5 hover:border-glow-400/40 hover:bg-night-850 hover:shadow-[0_14px_30px_rgba(36,56,43,0.09)]"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-glow-500/15 text-glow-300 group-hover:bg-glow-500/20">
                  <c.Icon className="h-5 w-5" />
                </div>
                <div className="mb-1 text-sm font-semibold leading-snug text-mist-100">{c.title}</div>
                <div className="text-xs leading-relaxed text-mist-500">{c.body}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle sub="Gentle signals of the work you are doing.">Your progress</SectionTitle>
          <div className="mb-8 grid grid-cols-3 gap-2.5">
            {metricCards.map((m) => (
              <Card key={m.label} className="!rounded-2xl !p-3.5 text-center sm:!p-4">
                <div className="font-display text-2xl text-glow-300">{m.value}</div>
                <div className="mt-1 text-[11px] leading-tight text-mist-500">{m.label}</div>
              </Card>
            ))}
          </div>

          <SectionTitle>A small step for today</SectionTitle>
          <Card className="mb-4 border-glow-400/25 bg-glow-500/10">
            <p className="mb-4 leading-relaxed text-mist-100">{smallStep}</p>
            <button
              onClick={markStepDone}
              className="inline-flex items-center gap-2 rounded-full border border-glow-400/35 bg-glow-400/15 px-4 py-2 text-sm font-medium text-glow-300 hover:bg-glow-400/25"
            >
              <IconCheck className="h-4 w-4" />
              Mark as done
            </button>
            <p className="mt-3 text-xs leading-relaxed text-mist-500">
              Doing one meaningful thing, even with some anxiety present, is how
              confidence grows.
            </p>
          </Card>
          <SafetyNote />
        </section>
      </div>
    </Screen>
  );
}
