/**
 * Cross-device sync for the OpenRouter API key + model.
 *
 * The key is normally kept in this browser's localStorage. With the
 * "Sync across devices" toggle ON, the key + model are also written to
 * Firestore under your own account tree
 * (users/{uid}/settings/openrouter). Firestore rules restrict that path to
 * you alone, so it is never shared with other users. On another device where
 * you sign in, the same code pulls the stored key back into localStorage.
 *
 * This is opt-in and you can turn it off (or clear the stored key) at any time.
 */
import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SYNC_PREF = 'psw_sync_key';
const KEY_STORAGE = 'psw_openrouter_key';
const MODEL_STORAGE = 'psw_openrouter_model';
const DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';

export function getStoredKey(): string {
  return localStorage.getItem(KEY_STORAGE) || '';
}

export function getStoredModel(): string {
  return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
}

export function getSyncPref(): boolean {
  return localStorage.getItem(SYNC_PREF) === 'true';
}
export function setSyncPref(on: boolean) {
  localStorage.setItem(SYNC_PREF, String(on));
}

/** Pull account-synced settings onto every signed-in device. */
export function useSyncedSettings(uid: string | null) {
  const [enabled, setEnabled] = useState(getSyncPref);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uid) {
      setEnabled(false);
      setError('');
      return;
    }

    const unsub = onSnapshot(
      doc(db, 'users', uid, 'settings', 'openrouter'),
      (snap) => {
        setError('');
        if (!snap.exists()) {
          setSyncPref(false);
          setEnabled(false);
          return;
        }

        const data = snap.data() as { key?: string; model?: string };
        if (typeof data.key === 'string') {
          localStorage.setItem(KEY_STORAGE, data.key);
        }
        if (typeof data.model === 'string') {
          localStorage.setItem(MODEL_STORAGE, data.model);
        }
        setSyncPref(true);
        setEnabled(true);
      },
      (snapshotError) => {
        setError(snapshotError.message);
      },
    );
    return unsub;
  }, [uid]);

  return { enabled, error };
}

/** Push the current key/model to Firestore (only when sync is enabled). */
export async function pushSyncedSettings(
  uid: string | null,
  key: string,
  model: string,
) {
  if (!uid || !getSyncPref()) return;
  const { setUserDoc } = await import('../lib/db');
  await setUserDoc(uid, 'settings', 'openrouter', {
    key,
    model,
    updatedAt: Date.now(),
  });
}

/** Remove the synced copy from Firestore (keeps the local copy). */
export async function clearSyncedSettings(uid: string | null) {
  if (!uid) return;
  const { deleteItem } = await import('../lib/db');
  await deleteItem(uid, 'settings', 'openrouter');
}