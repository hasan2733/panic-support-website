/**
 * Panic Mode — a calm, low-distraction full-screen overlay for difficult moments.
 */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDoc, setUserDoc } from '../lib/db';
import type { CopingCard } from '../types';
import { Card, Field, GhostButton, PrimaryButton } from './ui';
import { IconClose, IconGround, IconHeart, IconJournal, IconWave } from './icons';

const DEFAULT_CARD: CopingCard = {
  title: 'My coping card',
  steps:
    '1. This is panic, not danger. It will pass on its own.\n2. Slow my breathing: in 4, out 6 — easy and unforced.\n3. Name what I can see, hear and feel around me.\n4. Let the feelings be present without fighting them.\n5. Choose one small, safe next step.',
  updatedAt: 0,
};

const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see around you.' },
  { count: 4, sense: 'feel', prompt: 'Notice 4 things you can feel — texture, temperature, pressure.' },
  { count: 3, sense: 'hear', prompt: 'Listen for 3 things you can hear.' },
  { count: 2, sense: 'smell', prompt: 'Notice 2 things you can smell.' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste.' },
];

function BreathingGuide() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [cycles, setCycles] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setTimeout(
      () => {
        setPhase((p) => {
          if (p === 'out') setCycles((c) => c + 1);
          return p === 'in' ? 'out' : 'in';
        });
      },
      phase === 'in' ? 4000 : 6000,
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [running, phase]);

  const stop = () => {
    setRunning(false);
    setPhase('in');
    if (timer.current) window.clearTimeout(timer.current);
  };

  if (!running) {
    return (
      <div className="text-center">
        <p className="text-sm text-mist-500 mb-4 leading-relaxed">
          Optional: follow the circle. Breathe in for 4, out for 6. Nothing to
          force — skip this if breath focus bothers you.
        </p>
        <button
          onClick={() => {
            setCycles(0);
            setPhase('in');
            setRunning(true);
          }}
          className="rounded-full bg-glow-400/15 border border-glow-400/35 text-glow-300 px-5 py-2.5 text-sm font-medium hover:bg-glow-400/25"
        >
          Start breathing guide
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center h-48 mb-1">
        <div className="relative grid place-items-center">
          <div
            className="absolute rounded-full bg-glow-400/10"
            style={{
              width: phase === 'in' ? 176 : 116,
              height: phase === 'in' ? 176 : 116,
              transition: `width ${phase === 'in' ? 4 : 6}s ease-in-out, height ${phase === 'in' ? 4 : 6}s ease-in-out`,
            }}
          />
          <div
            className="rounded-full bg-glow-400/20 border border-glow-300/50 shadow-[0_0_40px_rgba(125,206,180,0.25)]"
            style={{
              width: phase === 'in' ? 140 : 86,
              height: phase === 'in' ? 140 : 86,
              transition: `width ${phase === 'in' ? 4 : 6}s ease-in-out, height ${phase === 'in' ? 4 : 6}s ease-in-out`,
            }}
          />
        </div>
      </div>
      <p className="font-display text-2xl text-mist-50 mb-1">
        {phase === 'in' ? 'Breathe in' : 'Breathe out'}
      </p>
      <p className="text-xs text-mist-600 mb-4">
        {cycles} {cycles === 1 ? 'breath' : 'breaths'} · easy, unforced
      </p>
      <button
        onClick={stop}
        className="rounded-full border border-white/10 text-mist-300 px-5 py-2 text-sm hover:bg-white/5"
      >
        Stop
      </button>
    </div>
  );
}

function GroundingWalkthrough() {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const step = GROUNDING_STEPS[stepIdx];

  if (done) {
    return (
      <div className="text-center py-2">
        <p className="font-display text-lg text-glow-300 mb-1">Well done.</p>
        <p className="text-sm text-mist-500 mb-3 leading-relaxed">
          You are here, in this moment. The feeling will pass.
        </p>
        <button
          className="text-sm text-mist-500"
          onClick={() => {
            setStepIdx(0);
            setDone(false);
          }}
        >
          Do it again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {GROUNDING_STEPS.map((s, i) => (
          <div
            key={s.sense}
            className={`h-1 flex-1 rounded-full ${
              i <= stepIdx ? 'bg-glow-400' : 'bg-night-600'
            }`}
          />
        ))}
      </div>
      <p className="text-mist-100 font-medium mb-1 leading-relaxed">
        {step.count} — {step.prompt}
      </p>
      <p className="text-xs text-mist-600 mb-4">Take your time. There is no rush.</p>
      <div className="flex gap-2">
        {stepIdx > 0 && (
          <GhostButton onClick={() => setStepIdx(stepIdx - 1)}>Back</GhostButton>
        )}
        <PrimaryButton
          onClick={() =>
            stepIdx === GROUNDING_STEPS.length - 1
              ? setDone(true)
              : setStepIdx(stepIdx + 1)
          }
        >
          {stepIdx === GROUNDING_STEPS.length - 1 ? 'Finish' : 'Next'}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function PanicMode({
  onClose,
  onLogEpisode,
}: {
  onClose: () => void;
  onLogEpisode: () => void;
}) {
  const { user } = useAuth();
  const [card, setCard] = useState<CopingCard>(DEFAULT_CARD);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!user) return;
    getUserDoc<CopingCard>(user.uid, 'copingCards', 'default').then((c) => {
      if (c) setCard(c);
    });
  }, [user]);

  const saveCard = async () => {
    if (!user) return;
    const next: CopingCard = {
      title: 'My coping card',
      steps: draft.trim() || DEFAULT_CARD.steps,
      updatedAt: Date.now(),
    };
    await setUserDoc(user.uid, 'copingCards', 'default', next);
    setCard(next);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night-950/95 overflow-y-auto">
      <div className="ambient" aria-hidden="true" />
      <div className="relative max-w-lg mx-auto px-5 pt-7 pb-16">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-glow-400/80 mb-2 font-medium">
              You are here
            </p>
            <h1 className="font-display text-3xl text-mist-50 font-medium">
              You are safe.
            </h1>
            <p className="text-mist-500 text-sm mt-2 leading-relaxed max-w-[34ch]">
              This feeling is uncomfortable, not dangerous. It will pass on its
              own.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panic mode"
            className="w-10 h-10 rounded-full border border-white/10 text-mist-500 hover:text-mist-100 grid place-items-center shrink-0"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <Card className="mb-4 border-glow-400/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-mist-50 flex items-center gap-2">
              <IconJournal className="w-4 h-4 text-glow-300" />
              My coping card
            </h2>
            <button
              className="text-xs text-glow-300"
              onClick={() => {
                setDraft(card.steps);
                setEditing(!editing);
              }}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <>
              <Field label="Write this when you are calm, read it when you need it.">
                <textarea
                  rows={6}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </Field>
              <PrimaryButton onClick={saveCard}>Save coping card</PrimaryButton>
            </>
          ) : (
            <p className="text-sm text-mist-300 whitespace-pre-line leading-relaxed">
              {card.steps}
            </p>
          )}
        </Card>

        <Card className="mb-4">
          <h2 className="font-display text-lg text-mist-50 mb-3 flex items-center gap-2">
            <IconWave className="w-4 h-4 text-glow-300" />
            Breathing guide
          </h2>
          <BreathingGuide />
        </Card>

        <Card className="mb-4">
          <h2 className="font-display text-lg text-mist-50 mb-3 flex items-center gap-2">
            <IconGround className="w-4 h-4 text-glow-300" />
            Grounding: 5-4-3-2-1
          </h2>
          <GroundingWalkthrough />
        </Card>

        <Card className="mb-4">
          <h2 className="font-display text-lg text-mist-50 mb-2 flex items-center gap-2">
            <IconHeart className="w-4 h-4 text-glow-300" />
            Let it be there
          </h2>
          <p className="text-sm text-mist-300 leading-relaxed">
            You do not have to fight this feeling or make it disappear. Try to
            let it be present, like a wave passing through. Keep doing one
            small, safe thing — sit, sip water, feel your feet on the floor.
            Courage is not the absence of fear; it is choosing your next step
            while afraid.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-lg text-mist-50 mb-2">Afterwards</h2>
          <p className="text-sm text-mist-500 mb-4 leading-relaxed">
            When you feel ready, logging what happened helps you spot patterns
            — and notice the times the feared catastrophe did not happen.
          </p>
          <PrimaryButton onClick={onLogEpisode}>Log this episode</PrimaryButton>
        </Card>
      </div>
    </div>
  );
}
