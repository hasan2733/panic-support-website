/**
 * Small typed helpers around Firestore so components stay readable.
 * All data lives under `users/{uid}/<collection>` (per-user tree).
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

/** Every collection used by the app (for export + delete-all). */
export const USER_COLLECTIONS = [
  'thoughtRecords',
  'episodes',
  'reflections',
  'practiceSessions',
  'favorites',
  'faithNotes',
  'chatMessages',
  'plans',
  'copingCards',
] as const;

const userCol = (uid: string, name: string) =>
  collection(db, 'users', uid, name);

/** Add a document (createdAt is stamped automatically). */
export async function addItem(
  uid: string,
  col: string,
  data: object,
) {
  return addDoc(userCol(uid, col), { ...data, createdAt: Date.now() });
}

/** Update fields of an existing document. */
export async function updateItem(
  uid: string,
  col: string,
  id: string,
  data: object,
) {
  return updateDoc(
    doc(db, 'users', uid, col, id),
    data as DocumentData,
  );
}

/** Delete one document. */
export async function deleteItem(uid: string, col: string, id: string) {
  return deleteDoc(doc(db, 'users', uid, col, id));
}

/** Write (or merge into) a document with a FIXED id, e.g. the safety plan. */
export async function setUserDoc(
  uid: string,
  col: string,
  id: string,
  data: object,
) {
  return setDoc(
    doc(db, 'users', uid, col, id),
    data as DocumentData,
    { merge: true },
  );
}

/** Read a single document with a fixed id (null when it does not exist). */
export async function getUserDoc<T>(
  uid: string,
  col: string,
  id: string,
): Promise<T | null> {
  const snap = await getDoc(doc(db, 'users', uid, col, id));
  return snap.exists() ? (snap.data() as T) : null;
}

/** Download everything the user has stored, as a plain JSON object. */
export async function exportUserData(
  uid: string,
): Promise<Record<string, unknown[]>> {
  const out: Record<string, unknown[]> = {};
  for (const col of USER_COLLECTIONS) {
    const snap = await getDocs(query(userCol(uid, col)));
    out[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return out;
}

/** Permanently delete EVERYTHING the user has stored. Cannot be undone. */
export async function wipeUserData(uid: string) {
  for (const col of USER_COLLECTIONS) {
    const snap = await getDocs(query(userCol(uid, col)));
    // Firestore batches are limited to 500 writes; chunk just in case.
    const docs = snap.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const batch = writeBatch(db);
      docs.slice(i, i + 500).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
}
