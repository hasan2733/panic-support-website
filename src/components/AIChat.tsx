/**
 * AI Chat — a CBT-oriented reflection companion powered by OpenRouter.
 * The user enters their OWN OpenRouter API key in Settings; it is stored
 * only in the browser's localStorage, masked in the UI, and never logged.
 * The assistant is bounded: supportive CBT coaching only — never diagnoses,
 * never gives medical advice, and NEVER generates/quotes/paraphrases
 * Quranic verses, hadith, or duas.
 */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { addItem, deleteItem } from '../lib/db';
import type { ChatMessage, TabId } from '../types';
import { Card, EmptyState, GhostButton, PageHeader, SafetyNote, Screen } from './ui';
import { IconChat, IconKey, IconSend } from './icons';

const KEY_STORAGE = 'psw_openrouter_key';
const MODEL_STORAGE = 'psw_openrouter_model';
const DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';

const SYSTEM_PROMPT = `You are a supportive CBT (cognitive behavioral therapy) reflection companion inside a personal panic-disorder support app. Your role:

- Help the user examine anxious thoughts: ask about the situation, the automatic thought, evidence for and against it, and alternative interpretations.
- Suggest well-established calming skills: slow breathing (in 4, out 6), 5-4-3-2-1 grounding, progressive muscle relaxation, thought labeling, self-compassion.
- Be warm, brief, and practical. Ask one question at a time. Never lecture.
- NEVER diagnose any condition, never give medical advice, never comment on medication, and never claim to know what a physical symptom means.
- NEVER generate, quote, paraphrase, complete, or attribute Quranic verses, hadith, duas, or any religious texts. If the user asks for religious content, gently say you cannot provide religious quotations and suggest they visit the app's Faith Corner, which contains verified content.
- If the user describes a crisis, self-harm, or urges to harm themselves or others, respond with care and urge them to contact a trusted person, a local crisis helpline, or emergency services immediately.
- Encourage professional treatment as a complement to self-help, never as a replacement.
- Do not reinforce reassurance-seeking loops: avoid repeatedly telling the user they are "safe" as a certainty; instead help them tolerate uncertainty and choose valued actions.`;

export function getStoredKey(): string {
  return localStorage.getItem(KEY_STORAGE) || '';
}

export function getStoredModel(): string {
  return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
}

interface ApiMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function AIChat({ onTab }: { onTab: (t: TabId) => void }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const { items: messages } = useCollection<ChatMessage>(uid, 'chatMessages');

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasKey = getStoredKey().length > 0;

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
      // Save the user's message first.
      await addItem(uid, 'chatMessages', { role: 'user', content: text });

      // Build a short history window for context.
      // useCollection returns newest-first, so take the 20 most recent
      // and flip them into chronological order for the API.
      const history: ApiMsg[] = messages
        .slice(0, 20)
        .reverse()
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
      await addItem(uid, 'chatMessages', { role: 'assistant', content: reply });
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

  if (!hasKey) {
    return (
      <Screen>
        <PageHeader
          kicker="Companion"
          title="Reflection chat"
          sub="A CBT reflection companion. Not a therapist, not medical advice."
        />
        <Card>
          <EmptyState
            icon={<IconKey className="w-5 h-5" />}
            title="Add your OpenRouter key to begin"
            body="The chat uses your own free OpenRouter API key. It stays in this browser only — never on any server."
          />
          <button
            onClick={() => onTab('more')}
            className="w-full rounded-2xl bg-glow-400 text-night-950 font-semibold px-4 py-3.5 hover:bg-glow-300"
          >
            Go to Settings
          </button>
          <p className="text-xs text-mist-600 mt-3 leading-relaxed">
            Get a free key at openrouter.ai, then paste it into Settings. The
            default model is a free one; you can change it there too.
          </p>
        </Card>
        <SafetyNote />
      </Screen>
    );
  }

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

      <div className="flex-1 space-y-3 mb-4">
        {messages.length === 0 && (
          <Card>
            <EmptyState
              icon={<IconChat className="w-5 h-5" />}
              title="How are you feeling right now?"
              body="Tell me what is on your mind, and we will look at it together — one small step at a time."
            />
          </Card>
        )}
        {messages.map((m) => (
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
              {m.content}
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

      {error && (
        <p className="text-sm text-rosesoft-300 bg-rosesoft-300/10 border border-rosesoft-300/25 rounded-2xl px-3.5 py-2.5 mb-3">
          {error}
        </p>
      )}

      <div className="sticky bottom-[calc(5.4rem+env(safe-area-inset-bottom))] pb-2">
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
            disabled={sending}
            className="!py-3.5"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            aria-label="Send"
            className="shrink-0 w-12 rounded-2xl bg-glow-400 hover:bg-glow-300 disabled:opacity-50 text-night-950 grid place-items-center"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
        <GhostButton onClick={() => onTab('more')} className="mt-2 !py-1.5 !text-xs">
          Change API key / model in Settings
        </GhostButton>
      </div>

      <SafetyNote compact />
    </Screen>
  );
}
