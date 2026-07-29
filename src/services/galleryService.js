import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

const PHOTOS_COLLECTION = 'photos';

/**
 * Fetches photos from the Firestore 'photos' collection.
 * @param {string} [category] - Optional category to filter by
 * @returns {Promise<Array>} Array of photo objects with id included
 */
export async function getPhotos(category) {
  const photosRef = collection(db, PHOTOS_COLLECTION);

  let q;
  if (category) {
    q = query(
      photosRef,
      where('category', '==', category),
      orderBy('uploadedAt', 'desc')
    );
  } else {
    q = query(photosRef, orderBy('uploadedAt', 'desc'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Fetches distinct categories from the photos collection.
 * Derives categories by reading all photos and extracting unique category values.
 * @returns {Promise<string[]>} Array of unique category strings
 */
export async function getCategories() {
  const photosRef = collection(db, PHOTOS_COLLECTION);
  const snapshot = await getDocs(photosRef);

  const categories = new Set();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.category) {
      categories.add(data.category);
    }
  });

  return Array.from(categories).sort();
}
