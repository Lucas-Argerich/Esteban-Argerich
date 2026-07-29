import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

const PHOTOS_COLLECTION = 'photos';

/**
 * Fetches all photos from the Firestore 'photos' collection.
 * Filtering by category is done client-side to avoid needing a composite index.
 * @param {string} [category] - Optional category to filter by (client-side)
 * @returns {Promise<Array>} Array of photo objects with id included
 */
export async function getPhotos(category) {
  const photosRef = collection(db, PHOTOS_COLLECTION);
  const q = query(photosRef, orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);

  let photos = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  if (category) {
    photos = photos.filter((p) => p.category === category);
  }

  return photos;
}

/**
 * Fetches distinct categories from the photos collection.
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
