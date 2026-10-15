/**
 * AI Chat — a CBT-oriented reflection companion powered by OpenRouter.
 * The user's OpenRouter API key stays in localStorage unless account sync is
 * enabled. It is masked in the UI and never logged.
 * The assistant is bounded: supportive CBT coaching only — never diagnoses,
 * never gives medical advice, and NEVER generates/quotes/paraphrases
 * Quranic verses, hadith, or duas.
 */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import {
  getStoredKey,
  getStoredModel,
  useSyncedSettings,
} from '../hooks/useSyncedSettings';
import { addItem, deleteItem } from '../lib/db';
import type { ChatMessage } from '../types';
import { Card, EmptyState, GhostButton, PageHeader, SafetyNote, Screen } from './ui';
import { IconChat, IconKey, IconSend, IconSent } from './icons';

/** Render a local date and time so older messages are unambiguous. */
function formatDateTime(ts: number): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const SYSTEM_PROMPT = `You are a supportive CBT (cognitive behavioral therapy) reflection companion inside a personal panic-disorder support app. Your role:

- Help the user examine anxious thoughts: ask about the situation, the automatic thought, evidence for and against it, and alternative interpretations.
- Suggest well-established calming skills: slow breathing (in 4, out 6), 5-4-3-2-1 grounding, progressive muscle relaxation, thought labeling, self-compassion.
- Be warm, brief, and practical. Ask one question at a time. Never lecture.
- NEVER diagnose any condition, never give medical advice, never comment on medication, and never claim to know what a physical symptom means.
- NEVER generate, quote, paraphrase, complete, or attribute Quranic verses, hadith, duas, or any religious texts. If the user asks for religious content, gently say you cannot provide religious quotations and suggest they visit the app's Faith Corner, which contains verified content.
- If the user describes a crisis, self-harm, or urges to harm themselves or others, respond with care and urge them to contact a trusted person, a local crisis helpline, or emergency services immediately.
- Encourage professional treatment as a complement to self-help, never as a replacement.
- Do not reinforce reassurance-seeking loops: avoid repeatedly telling the user they are "safe" as a certainty; instead help them tolerate uncertainty and choose valued actions.`;

interface ApiMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function AIChat({
  onSettings,
}: {
  onSettings: () => void;
}) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items: messages, loading, error: messagesError } = useCollection<ChatMessage>(
    uid,
    'chatMessages',
  );
  const { error: settingsError } = useSyncedSettings(uid);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasKey = getStoredKey().length > 0;
  const sortedMessages = [...messages].sort(
    (a, b) =>
      (a.timestamp ?? a.createdAt) - (b.timestamp ?? b.createdAt) ||
      a.createdAt - b.createdAt ||
      a.id.localeCompare(b.id),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, sending]);

  const send = async () => {
    const text = input.trim();
    if (!uid || !text || sending) return;
    const key = getStoredKey();
    if (!key) {
      setError('Add your OpenRouter API key in Settings first.');
      return;
    }
    setError('');
    setSending(true);
    setInput('');
    try {
      const now = Date.now();
      // Save the user's message first.
      await addItem(uid, 'chatMessages', {
        role: 'user',
        content: text,
        timestamp: now,
      });

      // Build a short history window for context.
      // Use the same chronological order shown in the transcript.
      const history: ApiMsg[] = sortedMessages
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: text });

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Panic Support Website',
        },
        body: JSON.stringify({
          model: getStoredModel(),
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          max_tokens: 600,
        }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            'The API key was rejected. Check it in Settings — it must be a valid OpenRouter key.',
          );
        }
        if (res.status === 429) {
          throw new Error(
            'Rate limit reached on OpenRouter. Wait a moment and try again.',
          );
        }
        throw new Error(`OpenRouter returned an error (${res.status}).`);
      }

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content?.trim() ||
        'I could not generate a reply just now. Please try again.';
      await addItem(uid, 'chatMessages', {
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not reach the AI service. Check your connection.',
      );
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!uid || !window.confirm('Delete the whole chat history?')) return;
    // Delete one by one (simple and safe for a personal app).
    for (const m of messages) {
      await deleteItem(uid, 'chatMessages', m.id);
    }
  };

  return (
    <Screen className="flex flex-col min-h-dvh">
      <PageHeader
        kicker="Companion"
        title="Reflection chat"
        sub="A CBT reflection companion. Not a therapist, not medical advice."
        action={
          messages.length > 0 ? (
            <button onClick={clearChat} className="text-xs text-mist-600 shrink-0 mt-2">
              Clear
            </button>
          ) : undefined
        }
      />

      {!hasKey && (
        <Card className="mb-4 !p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-glow-400/20 bg-glow-500/10 text-glow-300">
              <IconKey className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-mist-50">Add an OpenRouter key to send messages</p>
              <p className="mt-0.5 text-xs leading-relaxed text-mist-500">
                Your saved chat history remains available. Add a key in Settings to continue chatting.
              </p>
            </div>
            <button
              onClick={onSettings}
              className="shrink-0 rounded-xl bg-glow-400 px-3 py-2 text-xs font-semibold text-night-950 hover:bg-glow-300"
            >
              Settings
            </button>
          </div>
        </Card>
      )}

      {(messagesError || settingsError) && (
        <p className="mb-3 rounded-2xl border border-rosesoft-300/25 bg-rosesoft-300/10 px-3.5 py-2.5 text-sm text-rosesoft-300">
          {messagesError
            ? `Could not load your chat history: ${messagesError}`
            : `Could not sync chat settings: ${settingsError}`}
        </p>
      )}

      <div className="mb-4 flex-1 space-y-3">
        <div className="max-h-[55dvh] min-h-[35dvh] space-y-3 overflow-y-auto rounded-3xl border border-white/5 bg-night-900/30 p-3 sm:p-5">
          {sortedMessages.length === 0 && !loading && (
            <EmptyState
              icon={<IconChat className="w-5 h-5" />}
              title="How are you feeling right now?"
              body="Tell me what is on your mind, and we will look at it together — one small step at a time."
            />
          )}
          {loading && sortedMessages.length === 0 && (
            <div className="flex justify-center py-6">
              <div className="h-7 w-7 rounded-full border-2 border-glow-400/30 border-t-glow-400 animate-spin" />
            </div>
          )}
          {sortedMessages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-glow-400/15 border border-glow-400/25 text-mist-50 rounded-br-md'
                    : 'bg-night-800/70 border border-white/5 text-mist-100 rounded-bl-md'
                }`}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                  {m.role === 'user' ? 'You' : 'Reflection companion'}
                </p>
                {m.content}
                <div
                  className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] uppercase tracking-wide ${
                    m.role === 'user' ? 'text-glow-300/70' : 'text-mist-600'
                  }`}
                >
                  <span>{formatDateTime(m.timestamp ?? m.createdAt)}</span>
                  {m.role === 'user' ? <IconSent className="w-3 h-3 opacity-70" /> : null}
                </div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-night-800/70 border border-white/5 rounded-2xl px-4 py-2.5 text-sm text-mist-500">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-rosesoft-300 bg-rosesoft-300/10 border border-rosesoft-300/25 rounded-2xl px-3.5 py-2.5 mb-3">
          {error}
        </p>
      )}

      <div className="sticky bottom-[calc(5.4rem+env(safe-area-inset-bottom))] rounded-3xl border border-white/10 bg-night-950/95 p-3 pb-2 shadow-xl backdrop-blur">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Write what's on your mind…"
            disabled={sending || !hasKey}
            className="!py-3.5"
          />
          <button
            onClick={send}
            disabled={sending || !hasKey || !input.trim()}
            aria-label="Send"
            className="shrink-0 w-12 rounded-2xl bg-glow-400 hover:bg-glow-300 disabled:opacity-50 text-night-950 grid place-items-center"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
        <GhostButton onClick={onSettings} className="mt-2 !py-1.5 !text-xs">
          {hasKey ? 'Change API key / model in Settings' : 'Open chat settings'}
        </GhostButton>
      </div>

      <SafetyNote compact />
    </Screen>
  );
}
