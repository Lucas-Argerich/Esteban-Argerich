import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

const WORKSHOPS_COLLECTION = 'workshops';

/**
 * Fetches workshops from the Firestore 'workshops' collection.
 * By default, filters to only active workshops for public display.
 * Results are ordered by date descending (upcoming first).
 *
 * @param {Object} [filters] - Optional filters to apply
 * @param {boolean} [filters.active] - Filter by active status (defaults to true)
 * @returns {Promise<Array>} Array of workshop objects with id included
 */
export async function getWorkshops(filters) {
  const workshopsRef = collection(db, WORKSHOPS_COLLECTION);

  const constraints = [orderBy('date', 'desc')];

  // Default to active === true unless explicitly overridden
  const activeFilter = filters?.active !== undefined ? filters.active : true;
  if (activeFilter !== null) {
    constraints.unshift(where('active', '==', activeFilter));
  }

  const q = query(workshopsRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Fetches a single workshop document by its ID.
 * @param {string} id - The Firestore document ID
 * @returns {Promise<Object|null>} The workshop object with id, or null if not found
 */
export async function getWorkshopById(id) {
  const docRef = doc(db, WORKSHOPS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

/**
 * Fetches a single workshop by its URL slug.
 * @param {string} slug - The workshop slug
 * @returns {Promise<Object|null>} The workshop object with id, or null if not found
 */
export async function getWorkshopBySlug(slug) {
  const workshopsRef = collection(db, WORKSHOPS_COLLECTION);
  const q = query(workshopsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}
