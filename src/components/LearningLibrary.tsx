/**
 * Learning Library — structured IN-PAGE views of trusted resources.
 * Summaries are our own words (never copied books); each resource links
 * to its official source. Notes, favorites and reading progress are
 * stored per user in Firestore.
 */
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem, deleteItem, updateItem } from '../lib/db';
import type { Favorite } from '../types';
import {
  BOOK_RECS,
  LEARNING_RESOURCES,
  type LearningResource,
} from '../data/learning';
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
} from './ui';
import { IconBook, IconStar } from './icons';

export default function LearningLibrary() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items: favorites } = useCollection<Favorite>(uid, 'favorites');

  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteFor, setNoteFor] = useState<string | null>(null);

  const favByRef = useMemo(() => {
    const map = new Map<string, Favorite & { id: string }>();
    favorites.forEach((f) => map.set(`${f.kind}:${f.refId}`, f));
    return map;
  }, [favorites]);

  const resourceFav = (id: string) => favByRef.get(`resource:${id}`);
  const bookFav = (id: string) => favByRef.get(`book:${id}`);

  const toggleFavorite = async (kind: 'resource' | 'book', refId: string) => {
    if (!uid) return;
    const existing = favByRef.get(`${kind}:${refId}`);
    if (existing) {
      await deleteItem(uid, 'favorites', existing.id);
    } else {
      await addItem(uid, 'favorites', { kind, refId, progress: 0 });
    }
  };

  const setProgress = async (id: string, progress: number) => {
    if (!uid) return;
    const existing = favByRef.get(`resource:${id}`);
    if (existing) {
      await updateItem(uid, 'favorites', existing.id, { progress });
    } else {
      await addItem(uid, 'favorites', {
        kind: 'resource',
        refId: id,
        progress,
      });
    }
  };

  const saveNote = async (kind: 'resource' | 'book', refId: string) => {
    if (!uid || !noteDraft.trim()) return;
    const existing = favByRef.get(`${kind}:${refId}`);
    if (existing) {
      await updateItem(uid, 'favorites', existing.id, { note: noteDraft.trim() });
    } else {
      await addItem(uid, 'favorites', {
        kind,
        refId,
        note: noteDraft.trim(),
        progress: 0,
      });
    }
    setNoteDraft('');
    setNoteFor(null);
  };

  const openResource = (r: LearningResource) => {
    setOpenId(r.id);
    setNoteFor(null);
    setNoteDraft('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const current = LEARNING_RESOURCES.find((r) => r.id === openId) ?? null;

  /* ---------- In-page resource reader ---------- */
  if (current) {
    const fav = resourceFav(current.id);
    return (
      <Screen>
        <button
          onClick={() => setOpenId(null)}
          className="text-sm text-glow-300 mb-5"
        >
          ← Back to library
        </button>
        <p className="text-[11px] uppercase tracking-[0.16em] text-mist-600 mb-2">{current.source}</p>
        <h1 className="font-display text-2xl sm:text-[1.85rem] leading-tight text-mist-50 mb-2">{current.title}</h1>
        <p className="text-mist-500 text-sm mb-6 italic leading-relaxed">{current.tagline}</p>

        <SectionTitle>Summary</SectionTitle>
        <div className="space-y-3 mb-6">
          {current.summary.map((p, i) => (
            <p key={i} className="text-sm text-mist-300 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <SectionTitle>Key takeaways</SectionTitle>
        <Card className="mb-6">
          <ul className="space-y-2.5">
            {current.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-mist-300 leading-relaxed">
                <span className="text-glow-300 shrink-0">·</span>
                {k}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-mist-100">Reading progress</h3>
            <span className="text-sm text-glow-300">{fav?.progress ?? 0}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={fav?.progress ?? 0}
            onChange={(e) => setProgress(current.id, Number(e.target.value))}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => toggleFavorite('resource', current.id)}
              className={`flex-1 rounded-2xl border text-sm font-medium py-2.5 ${
                fav
                  ? 'border-glow-400/50 bg-glow-500/15 text-glow-300'
                  : 'border-white/10 text-mist-300 hover:bg-white/5'
              }`}
            >
              {fav ? '★ Saved' : '☆ Save to favorites'}
            </button>
            <a
              href={current.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl bg-night-700/80 text-mist-100 text-sm font-medium py-2.5 text-center hover:bg-night-600"
            >
              Official source ↗
            </a>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-mist-100 mb-2">My notes</h3>
          {fav?.note ? (
            <p className="text-sm text-mist-300 whitespace-pre-line mb-3 leading-relaxed">
              {fav.note}
            </p>
          ) : (
            <p className="text-sm text-mist-600 mb-3">
              No notes yet. What stood out to you?
            </p>
          )}
          {noteFor === current.id ? (
            <>
              <Field label="Add or replace your note">
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="What will you try from this?"
                />
              </Field>
              <div className="flex gap-2">
                <GhostButton onClick={() => setNoteFor(null)}>Cancel</GhostButton>
                <PrimaryButton
                  onClick={() => saveNote('resource', current.id)}
                >
                  Save note
                </PrimaryButton>
              </div>
            </>
          ) : (
            <button
              className="text-sm text-glow-300"
              onClick={() => {
                setNoteFor(current.id);
                setNoteDraft(fav?.note ?? '');
              }}
            >
              {fav?.note ? 'Edit note' : 'Write a note'}
            </button>
          )}
        </Card>

        <SafetyNote />
      </Screen>
    );
  }

  /* ---------- Library overview ---------- */
  return (
    <Screen>
      <PageHeader
        kicker="Learn"
        title="Library"
        sub="Structured summaries that open right here. Full material lives at the official source."
      />

      <div className="space-y-3 mb-10">
        {LEARNING_RESOURCES.map((r) => {
          const fav = resourceFav(r.id);
          return (
            <button
              key={r.id}
              onClick={() => openResource(r)}
              className="w-full text-left"
            >
              <Card className="hover:border-glow-400/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-mist-100">{r.title}</h3>
                    <p className="text-xs text-mist-600 mt-0.5">{r.source}</p>
                    <p className="text-sm text-mist-500 mt-1.5 italic">
                      {r.tagline}
                    </p>
                  </div>
                  {fav && <IconStar filled className="w-4 h-4 text-glow-300 shrink-0" />}
                </div>
                {(fav?.progress ?? 0) > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-night-600 overflow-hidden">
                      <div
                        className="h-full bg-glow-400 rounded-full"
                        style={{ width: `${fav?.progress ?? 0}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-mist-600 mt-1">
                      {fav?.progress}% read
                    </p>
                  </div>
                )}
                <p className="text-sm text-glow-300 mt-3">Read here →</p>
              </Card>
            </button>
          );
        })}
      </div>

      <SectionTitle sub="Borrow from a library or buy second-hand — look for authorized editions.">
        Recommended books
      </SectionTitle>
      <div className="space-y-3">
        {BOOK_RECS.length === 0 && (
          <Card>
            <EmptyState icon={<IconBook className="w-5 h-5" />} title="No books yet" body="" />
          </Card>
        )}
        {BOOK_RECS.map((b) => {
          const fav = bookFav(b.id);
          return (
            <Card key={b.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-mist-100">{b.title}</h3>
                  <p className="text-xs text-mist-500 mt-0.5">{b.author}</p>
                  <p className="text-sm text-mist-300 mt-2 leading-relaxed">
                    {b.why}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite('book', b.id)}
                  aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
                  className={`px-1 ${
                    fav ? 'text-glow-300' : 'text-mist-600 hover:text-mist-300'
                  }`}
                >
                  <IconStar filled={!!fav} className="w-5 h-5" />
                </button>
              </div>
              {fav?.note && (
                <p className="text-sm text-mist-300 mt-2 p-3 rounded-2xl bg-night-900/60 border border-white/5 whitespace-pre-line">
                  {fav.note}
                </p>
              )}
              {noteFor === b.id ? (
                <div className="mt-3">
                  <Field label="Your note">
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <GhostButton onClick={() => setNoteFor(null)}>
                      Cancel
                    </GhostButton>
                    <PrimaryButton onClick={() => saveNote('book', b.id)}>
                      Save note
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <button
                  className="text-xs text-glow-300 mt-2"
                  onClick={() => {
                    setNoteFor(b.id);
                    setNoteDraft(fav?.note ?? '');
                  }}
                >
                  {fav?.note ? 'Edit note' : 'Add a note'}
                </button>
              )}
            </Card>
          );
        })}
      </div>

      <SafetyNote />
    </Screen>
  );
}
