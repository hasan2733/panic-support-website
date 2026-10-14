/**
 * useCollection — live Firestore subscription for one per-user collection.
 * Returns the documents (newest first) plus a loading flag.
 */
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WithId } from '../types';

export function useCollection<T extends { createdAt?: number }>(
  uid: string | null,
  collectionName: string,
) {
  const [items, setItems] = useState<WithId<T>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'users', uid, collectionName),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [uid, collectionName]);

  return { items, loading };
}
