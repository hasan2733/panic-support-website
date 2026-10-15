/**
 * Shared TypeScript types for the app's Firestore documents.
 * Every collection lives under `users/{uid}/<collection>` so each
 * person's data is fully separated (see firestore.rules).
 */

export interface ThoughtRecord {
  situation: string;
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeThought: string;
  balancedResponse: string;
  nextAction: string;
  createdAt: number;
}

export type EpisodeClassification = 'yes' | 'no' | 'unsure';

export interface Episode {
  symptoms: string[];
  intensity: number; // 1..10
  context: string;
  afterwards: string;
  classification: EpisodeClassification;
  minutesToNormal: number | null;
  createdAt: number;
}

export interface Reflection {
  kind: 'weekly' | 'general';
  text: string;
  createdAt: number;
}

export interface PracticeSession {
  techniqueId: string;
  kind: 'technique' | 'meditation' | 'small-step';
  minutes?: number;
  createdAt: number;
}

export interface Favorite {
  kind: 'resource' | 'book';
  refId: string;
  note?: string;
  /** Reading progress 0..100 (resources only) */
  progress?: number;
  createdAt: number;
}

export interface FaithNote {
  kind: 'gratitude' | 'note';
  text: string;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  /** When this message was written (ms since epoch). Defaults to createdAt. */
  timestamp?: number;
}

/** A named free-text plan, e.g. the safety plan or coping card. */
export interface PlanDoc {
  title: string;
  body: string;
  updatedAt: number;
}

/** Personal coping card shown inside Panic Mode. */
export interface CopingCard {
  title: string;
  steps: string;
  updatedAt: number;
}

/** Firestore document with its id attached (used by the useCollection hook). */
export type WithId<T> = T & { id: string };

/** Tabs of the bottom navigation bar. */
export type TabId = 'home' | 'journal' | 'practice' | 'learn' | 'chat' | 'more';

/** Secondary screens reachable from the "More" menu. */
export type MoreView = 'episodes' | 'faith' | 'settings' | null;
