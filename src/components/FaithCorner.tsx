/**
 * Faith Corner — an OPTIONAL, separate space for spiritual reflection.
 * Content is FIXED and verified (see src/data/faith.ts). The app never
 * generates, invents, or paraphrases religious texts anywhere.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem, deleteItem } from '../lib/db';
import type { FaithNote } from '../types';
import {
  AYATUL_KURSI,
  DUA_YUNUS,
  DUA_YUNUS_AUDIO,
  DUAS,
  FAITH_INTRO,
  ISME_AZAM_QURAN_READINGS,
  ISME_AZAM_SUPPLICATIONS,
  QURAN_READINGS,
  VERSE,
} from '../data/faith';
import {
  Card,
  EmptyState,
  Field,
  PageHeader,
  PrimaryButton,
  SafetyNote,
  Screen,
  SectionTitle,
  fmtDate,
} from './ui';
import { IconHands } from './icons';

function QuranCard({
  title,
  reference,
  arabic,
  english,
  sourceUrl,
  audioUrl,
  audioLabel,
  className = '',
}: {
  title: string;
  reference: string;
  arabic: string;
  english: string;
  sourceUrl: string;
  audioUrl: string;
  audioLabel: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-glow-300">
        {reference}
      </p>
      <h3 className="mb-4 font-display text-lg font-medium text-mist-50">{title}</h3>
      <p
        dir="rtl"
        lang="ar"
        className="font-arabic mb-5 text-right text-[1.75rem] leading-[2.2] text-mist-50 sm:text-3xl"
      >
        {arabic}
      </p>
      <p className="mb-4 text-base leading-relaxed text-mist-300">{english}</p>
      <audio
        className="audio-player mb-3 w-full"
        controls
        preload="none"
        aria-label={audioLabel}
        src={audioUrl}
      >
        Your browser does not support audio playback.
      </audio>
      <p className="text-xs text-mist-500">
        Arabic recitation by Mishari Alafasy. English translation: Sahih International.{' '}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-glow-300 underline decoration-glow-300/40 underline-offset-2 hover:decoration-glow-300"
        >
          View source
        </a>
      </p>
    </Card>
  );
}

export default function FaithCorner() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items } = useCollection<FaithNote>(uid, 'faithNotes');

  const [text, setText] = useState('');
  const [kind, setKind] = useState<'gratitude' | 'note'>('gratitude');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!uid || !text.trim()) return;
    setBusy(true);
    try {
      await addItem(uid, 'faithNotes', { kind, text: text.trim() });
      setText('');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!uid || !window.confirm('Delete this entry?')) return;
    await deleteItem(uid, 'faithNotes', id);
  };

  const gratitude = items.filter((i) => i.kind === 'gratitude');
  const notes = items.filter((i) => i.kind === 'note');

  return (
    <Screen>
      <PageHeader
        kicker="Optional"
        title="Faith corner"
        sub="Separate from the clinical tools."
      />
      <p className="text-sm text-mist-500 leading-relaxed mb-6">{FAITH_INTRO}</p>

      {/* Fixed verified verse */}
      <Card className="mb-6 border-glow-400/25">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-glow-300">{VERSE.surah}</p>
        <p dir="rtl" lang="ar" className="font-arabic mb-4 text-right text-2xl leading-[2.1] text-mist-50 sm:text-3xl">
          {VERSE.arabic}
        </p>
        <p className="mb-4 text-base italic leading-relaxed text-mist-100">
          “{VERSE.english}”
        </p>
        <p className="mb-2 text-xs text-mist-500">{VERSE.attribution}</p>
        <audio
          className="audio-player mb-3 w-full"
          controls
          preload="none"
          aria-label="Listen to Surah Ash-Sharh"
          src="https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/94.mp3"
        >
          Your browser does not support audio playback.
        </audio>
        <a
          href={VERSE.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-sm font-medium text-glow-300 underline decoration-glow-300/40 underline-offset-2"
        >
          {VERSE.sourceLabel} ↗
        </a>
      </Card>

      <SectionTitle sub="A verse of remembrance with its own recitation.">
        Ayatul Kursi
      </SectionTitle>
      <QuranCard {...AYATUL_KURSI} className="mb-8" />

      <SectionTitle sub="Al-Ikhlas, Al-Falaq, and An-Nas.">
        The 3 Quls
      </SectionTitle>
      <div className="mb-8 grid gap-3 lg:grid-cols-2">
        {QURAN_READINGS.filter((reading) =>
          ['al-ikhlas', 'al-falaq', 'an-nas'].includes(reading.id),
        ).map((reading) => (
          <QuranCard key={reading.id} {...reading} />
        ))}
      </div>

      <SectionTitle sub="Short Surahs for recitation and reflection.">
        More Surahs
      </SectionTitle>
      <div className="mb-8 grid gap-3 lg:grid-cols-2">
        {QURAN_READINGS.filter((reading) =>
          ['al-fatiha', 'al-asr'].includes(reading.id),
        ).map((reading) => (
          <QuranCard key={reading.id} {...reading} />
        ))}
      </div>

      <SectionTitle sub="The supplication of Prophet Yunus (Jonah), from the Qur’an.">
        Dua Yunus
      </SectionTitle>
      <Card className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-glow-300">
          {DUA_YUNUS.source}
        </p>
        <p dir="rtl" lang="ar" className="font-arabic mb-4 text-right text-2xl leading-[2.1] text-mist-50 sm:text-3xl">
          {DUA_YUNUS.arabic}
        </p>
        <p className="mb-2 text-sm italic text-mist-500">{DUA_YUNUS.transliteration}</p>
        <p className="mb-4 text-base leading-relaxed text-mist-300">
          “{DUA_YUNUS.translation}”
        </p>
        <audio
          className="audio-player mb-3 w-full"
          controls
          preload="none"
          aria-label="Listen to the supplication of Prophet Yunus"
          src={DUA_YUNUS_AUDIO}
        >
          Your browser does not support audio playback.
        </audio>
        <p className="text-xs text-mist-500">
          Arabic recitation by Mishari Alafasy. English translation: Sahih International.{' '}
          <a
            href="https://quran.com/21/87"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-glow-300 underline decoration-glow-300/40 underline-offset-2"
          >
            View source
          </a>
        </p>
      </Card>

      <SectionTitle sub="The supplications and Qur’anic passages you shared, with references.">
        Ism-e-Azam
      </SectionTitle>
      <div className="mb-8 space-y-3">
        {ISME_AZAM_SUPPLICATIONS.map((dua) => (
          <Card key={dua.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-glow-300">
              {dua.reference}
            </p>
            <h3 className="mb-4 font-display text-lg font-medium text-mist-50">
              {dua.title}
            </h3>
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic mb-4 text-right text-2xl leading-[2.1] text-mist-50 sm:text-3xl"
            >
              {dua.arabic}
            </p>
            <p className="mb-4 text-base leading-relaxed text-mist-300">
              “{dua.english}”
            </p>
            {dua.banglaPronunciation && (
              <p lang="bn" className="font-bengali mb-2 text-base leading-relaxed text-mist-300">
                <span className="font-semibold text-mist-100">উচ্চারণ: </span>
                {dua.banglaPronunciation}
              </p>
            )}
            {dua.banglaMeaning && (
              <p lang="bn" className="font-bengali mb-4 text-base leading-relaxed text-mist-300">
                <span className="font-semibold text-mist-100">অর্থ: </span>
                {dua.banglaMeaning}
              </p>
            )}
            {dua.audioUrl ? (
              <>
                <audio
                  className="audio-player mb-3 w-full"
                  controls
                  preload="none"
                  aria-label={dua.audioLabel ?? `Listen to ${dua.title}`}
                  src={dua.audioUrl}
                >
                  Your browser does not support audio playback.
                </audio>
                <p className="mb-2 text-xs text-mist-500">
                  Arabic Qur’an recitation by Mishari Alafasy.
                </p>
              </>
            ) : (
              <p className="mb-3 text-sm leading-relaxed text-mist-500">
                Trusted recitation audio has not been added for this hadith yet.
              </p>
            )}
            <a
              href={dua.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-glow-300 underline decoration-glow-300/40 underline-offset-2"
            >
              Source and reference ↗
            </a>
          </Card>
        ))}
      </div>

      <SectionTitle sub="Other verses you mentioned in connection with these names.">
        More Qur’anic passages
      </SectionTitle>
      <div className="mb-8 grid gap-3 lg:grid-cols-2">
        {ISME_AZAM_QURAN_READINGS.map((reading) => (
          <QuranCard key={reading.id} {...reading} />
        ))}
      </div>

      <SectionTitle sub="For moments of distress, with sources.">
        Other duas
      </SectionTitle>
      <div className="mb-8 space-y-3">
        {DUAS.map((d) => (
          <Card key={d.id}>
            <p dir="rtl" lang="ar" className="font-arabic mb-3 text-right text-2xl leading-[2.1] text-mist-50">
              {d.arabic}
            </p>
            <p className="mb-2 text-sm italic text-mist-500">{d.transliteration}</p>
            <p className="mb-2 text-base leading-relaxed text-mist-300">{d.translation}</p>
            <p className="text-xs text-mist-500">{d.source}</p>
          </Card>
        ))}
      </div>

      {/* Gratitude + notes journal */}
      <SectionTitle sub="Saved privately, only for you.">Reflection journal</SectionTitle>
      <Card className="mb-5">
        <div className="flex gap-2 mb-3">
          {(
            [
              { id: 'gratitude', label: 'Gratitude' },
              { id: 'note', label: 'Reflection' },
            ] as const
          ).map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              className={`flex-1 rounded-2xl border text-sm font-medium py-2.5 ${
                kind === k.id
                  ? 'border-glow-400/50 bg-glow-500/15 text-glow-300'
                  : 'border-white/10 text-mist-500'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <Field
          label={kind === 'gratitude' ? 'What are you grateful for today?' : 'Your reflection'}
        >
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              kind === 'gratitude'
                ? 'e.g. A calm morning, a kind message…'
                : 'e.g. What did I learn about patience today?'
            }
          />
        </Field>
        <PrimaryButton onClick={save} disabled={busy || !text.trim()}>
          {busy ? 'Saving…' : 'Save entry'}
        </PrimaryButton>
      </Card>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconHands className="w-5 h-5" />}
            title="No entries yet"
            body="Gratitude and reflection, written in your own words, kept private."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {gratitude.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-mist-300 mt-2">Gratitude</h3>
              {gratitude.map((g) => (
                <Card key={g.id}>
                  <p className="text-xs text-mist-600 mb-1">{fmtDate(g.createdAt)}</p>
                  <p className="text-sm text-mist-100 whitespace-pre-line">{g.text}</p>
                  <button
                    onClick={() => remove(g.id)}
                    className="text-xs text-rosesoft-300/80 mt-2"
                  >
                    Delete
                  </button>
                </Card>
              ))}
            </>
          )}
          {notes.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-mist-300 mt-2">Reflections</h3>
              {notes.map((n) => (
                <Card key={n.id}>
                  <p className="text-xs text-mist-600 mb-1">{fmtDate(n.createdAt)}</p>
                  <p className="text-sm text-mist-100 whitespace-pre-line">{n.text}</p>
                  <button
                    onClick={() => remove(n.id)}
                    className="text-xs text-rosesoft-300/80 mt-2"
                  >
                    Delete
                  </button>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      <SafetyNote />
    </Screen>
  );
}
