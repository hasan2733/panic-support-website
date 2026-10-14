/**
 * CBT Thought Journal — examine an anxious prediction instead of
 * automatically believing it. The goal is learning to evaluate thoughts,
 * not forcing positive thinking.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem, deleteItem, updateItem } from '../lib/db';
import type { ThoughtRecord, WithId } from '../types';
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
import { IconJournal } from './icons';

const EMPTY: Omit<ThoughtRecord, 'createdAt'> = {
  situation: '',
  automaticThought: '',
  evidenceFor: '',
  evidenceAgainst: '',
  alternativeThought: '',
  balancedResponse: '',
  nextAction: '',
};

const FIELDS: { key: keyof typeof EMPTY; label: string; hint: string }[] = [
  {
    key: 'situation',
    label: 'Situation',
    hint: 'What was happening when the fear began?',
  },
  {
    key: 'automaticThought',
    label: 'Automatic thought',
    hint: 'What did your mind predict would happen?',
  },
  {
    key: 'evidenceFor',
    label: 'Evidence for this thought',
    hint: 'What seems to support this interpretation?',
  },
  {
    key: 'evidenceAgainst',
    label: 'Evidence against this thought',
    hint: 'What argues against it? Past experiences? Facts?',
  },
  {
    key: 'alternativeThought',
    label: 'Alternative interpretation',
    hint: 'What else could explain this situation?',
  },
  {
    key: 'balancedResponse',
    label: 'Balanced response',
    hint: 'A realistic, fair summary — not forced positivity.',
  },
  {
    key: 'nextAction',
    label: 'Next action',
    hint: 'One small step you will take, even with some anxiety.',
  },
];

export default function ThoughtJournal() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items, loading } = useCollection<ThoughtRecord>(uid, 'thoughtRecords');

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
  };

  const save = async () => {
    if (!uid || !form.situation.trim() || !form.automaticThought.trim()) return;
    setBusy(true);
    try {
      if (editingId) {
        await updateItem(uid, 'thoughtRecords', editingId, { ...form });
      } else {
        await addItem(uid, 'thoughtRecords', { ...form });
      }
      reset();
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (r: WithId<ThoughtRecord>) => {
    setForm({
      situation: r.situation,
      automaticThought: r.automaticThought,
      evidenceFor: r.evidenceFor,
      evidenceAgainst: r.evidenceAgainst,
      alternativeThought: r.alternativeThought,
      balancedResponse: r.balancedResponse,
      nextAction: r.nextAction,
    });
    setEditingId(r.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!uid || !window.confirm('Delete this thought record?')) return;
    await deleteItem(uid, 'thoughtRecords', id);
  };

  return (
    <Screen>
      <PageHeader
        kicker="CBT"
        title="Thought journal"
        sub="Examine a prediction instead of automatically believing it."
      />

      {!showForm ? (
        <PrimaryButton onClick={() => setShowForm(true)} className="mb-5">
          New thought record
        </PrimaryButton>
      ) : (
        <Card className="mb-5">
          <h3 className="font-display text-lg text-mist-50 mb-4">
            {editingId ? 'Edit thought record' : 'New thought record'}
          </h3>
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <textarea
                rows={f.key === 'situation' || f.key === 'automaticThought' ? 2 : 3}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </Field>
          ))}
          <div className="flex gap-2 mt-2">
            <GhostButton onClick={reset}>Cancel</GhostButton>
            <PrimaryButton onClick={save} disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Save changes' : 'Save record'}
            </PrimaryButton>
          </div>
        </Card>
      )}

      <SectionTitle sub="Look back to spot recurring patterns.">Previous entries</SectionTitle>
      {loading ? (
        <p className="text-mist-600 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconJournal className="w-5 h-5" />}
            title="No thought records yet"
            body="When an anxious thought shows up, capture it here and work through it step by step."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <Card key={r.id}>
              <p className="text-xs text-mist-600 mb-2">{fmtDateTime(r.createdAt)}</p>
              <p className="text-sm mb-1">
                <span className="text-mist-500">Situation: </span>
                <span className="text-mist-100">{r.situation}</span>
              </p>
              <p className="text-sm mb-1">
                <span className="text-mist-500">Thought: </span>
                <span className="text-mist-100 italic">“{r.automaticThought}”</span>
              </p>
              {r.balancedResponse && (
                <p className="text-sm mt-2 p-3 rounded-2xl bg-glow-500/10 border border-glow-500/20 text-mist-100 leading-relaxed">
                  {r.balancedResponse}
                </p>
              )}
              {r.nextAction && (
                <p className="text-sm text-mist-300 mt-2">
                  Next: {r.nextAction}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(r)}
                  className="text-xs text-glow-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="text-xs text-rosesoft-300/80"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SafetyNote />
    </Screen>
  );
}
