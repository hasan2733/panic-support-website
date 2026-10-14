/**
 * Episode Tracker — a structured panic log, not a symptom-checking loop.
 * Records: counter, symptoms, context, what happened afterwards, whether it
 * was actually a panic attack on reflection, and time taken to feel normal.
 * Reviewing these entries is how you notice the feared catastrophe
 * rarely happens — a core CBT insight.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem, deleteItem } from '../lib/db';
import type { Episode, EpisodeClassification, WithId } from '../types';
import {
  Card,
  EmptyState,
  Field,
  GhostButton,
  PageHeader,
  PrimaryButton,
  SafetyNote,
  Screen,
  SectionTitle,
  fmtDateTime,
} from './ui';
import { IconChart } from './icons';

const SYMPTOMS = [
  'Racing or pounding heart',
  'Shortness of breath',
  'Dizziness or lightheadedness',
  'Chest tightness or pain',
  'Sweating',
  'Trembling or shaking',
  'Nausea or stomach upset',
  'Fear of dying',
  'Fear of losing control',
  'Numbness or tingling',
];

const CLASSIFICATIONS: { id: EpisodeClassification; label: string; hint: string }[] = [
  { id: 'yes', label: 'Yes, it was panic', hint: 'The fear peaked and passed; nothing catastrophic happened.' },
  { id: 'no', label: 'No, something else', hint: 'On reflection it seems it was not a panic attack.' },
  { id: 'unsure', label: 'Not sure', hint: 'That is okay — uncertainty is allowed.' },
];

export default function EpisodeTracker() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items, loading } = useCollection<Episode>(uid, 'episodes');

  const [showForm, setShowForm] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(7);
  const [context, setContext] = useState('');
  const [afterwards, setAfterwards] = useState('');
  const [classification, setClassification] =
    useState<EpisodeClassification>('unsure');
  const [minutes, setMinutes] = useState('');
  const [busy, setBusy] = useState(false);

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const reset = () => {
    setSymptoms([]);
    setIntensity(7);
    setContext('');
    setAfterwards('');
    setClassification('unsure');
    setMinutes('');
    setShowForm(false);
  };

  const save = async () => {
    if (!uid) return;
    setBusy(true);
    try {
      const mins = minutes.trim() === '' ? null : Number(minutes);
      await addItem(uid, 'episodes', {
        symptoms,
        intensity,
        context: context.trim(),
        afterwards: afterwards.trim(),
        classification,
        minutesToNormal: Number.isFinite(mins) ? mins : null,
      });
      reset();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!uid || !window.confirm('Delete this episode record?')) return;
    await deleteItem(uid, 'episodes', id);
  };

  const badge = (e: WithId<Episode>) => {
    const map: Record<EpisodeClassification, string> = {
      yes: 'bg-glow-500/15 text-glow-300 border-glow-500/40',
      no: 'bg-night-700 text-mist-300 border-night-600',
      unsure: 'bg-warm-300/10 text-warm-300 border-warm-300/30',
    };
    const label: Record<EpisodeClassification, string> = {
      yes: 'Was panic',
      no: 'Not panic',
      unsure: 'Unsure',
    };
    return (
      <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 border ${map[e.classification]}`}>
        {label[e.classification]}
      </span>
    );
  };

  return (
    <Screen>
      <PageHeader
        kicker="Patterns"
        title="Episode tracker"
        sub="A calm record — not a symptom check. Patterns here build confidence."
      />

      <Card className="mb-5 text-center border-glow-400/20">
        <div className="font-display text-4xl text-glow-300">{items.length}</div>
        <div className="text-sm text-mist-500 mt-1">
          {items.length === 1 ? 'episode logged' : 'episodes logged'}
        </div>
        <p className="text-xs text-mist-600 mt-2 leading-relaxed">
          Each logged episode is evidence you got through it.
        </p>
      </Card>

      {!showForm ? (
        <PrimaryButton onClick={() => setShowForm(true)} className="mb-5">
          Log an episode
        </PrimaryButton>
      ) : (
        <Card className="mb-5">
          <h3 className="font-display text-lg text-mist-50 mb-4">Log an episode</h3>

          <Field label="What did you feel? (tick all that apply)">
            <div className="grid grid-cols-1 gap-1.5">
              {SYMPTOMS.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2.5 text-sm text-mist-300 cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={symptoms.includes(s)}
                    onChange={() => toggleSymptom(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </Field>

          <Field label={`Intensity: ${intensity}/10`}>
            <input
              type="range"
              min={1}
              max={10}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </Field>

          <Field label="Context" hint="Where were you? What was happening?">
            <textarea
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. On the bus, on the way to work…"
            />
          </Field>

          <Field
            label="What happened afterwards?"
            hint="What did you do? What was the actual outcome?"
          >
            <textarea
              rows={3}
              value={afterwards}
              onChange={(e) => setAfterwards(e.target.value)}
              placeholder="e.g. I sat down, breathed slowly, and it faded after a few minutes. Nothing bad happened."
            />
          </Field>

          <Field label="On reflection — was it actually a panic attack?">
            <div className="space-y-2">
              {CLASSIFICATIONS.map((c) => (
                <label
                  key={c.id}
                  className="flex items-start gap-2.5 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="classification"
                    checked={classification === c.id}
                    onChange={() => setClassification(c.id)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="text-mist-100 font-medium">{c.label}</span>
                    <span className="text-mist-600 block text-xs">{c.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Minutes until you felt normal again"
            hint="A rough estimate is fine. Leave blank if unsure."
          >
            <input
              type="number"
              min={0}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="e.g. 15"
            />
          </Field>

          <div className="flex gap-2 mt-2">
            <GhostButton onClick={reset}>Cancel</GhostButton>
            <PrimaryButton onClick={save} disabled={busy}>
              {busy ? 'Saving…' : 'Save episode'}
            </PrimaryButton>
          </div>
        </Card>
      )}

      <SectionTitle>History</SectionTitle>
      {loading ? (
        <p className="text-mist-600 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconChart className="w-5 h-5" />}
            title="No episodes logged"
            body="After a difficult moment, record what happened. Over time this becomes proof of your resilience."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((e) => (
            <Card key={e.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-mist-600">{fmtDateTime(e.createdAt)}</p>
                {badge(e)}
              </div>
              {e.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {e.symptoms.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] bg-night-900/80 border border-white/5 text-mist-300 rounded-full px-2.5 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-mist-500 mb-1">
                Intensity {e.intensity}/10
                {e.minutesToNormal !== null &&
                  ` · back to normal in ~${e.minutesToNormal} min`}
              </p>
              {e.context && (
                <p className="text-sm text-mist-300 mt-1">
                  <span className="text-mist-600">Context: </span>
                  {e.context}
                </p>
              )}
              {e.afterwards && (
                <p className="text-sm text-mist-300 mt-1">
                  <span className="text-mist-600">Afterwards: </span>
                  {e.afterwards}
                </p>
              )}
              <button
                onClick={() => remove(e.id)}
                className="text-xs text-rosesoft-300/80 mt-3"
              >
                Delete
              </button>
            </Card>
          ))}
        </div>
      )}

      <SafetyNote />
    </Screen>
  );
}
