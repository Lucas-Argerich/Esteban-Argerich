import { useState } from 'react';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../services/firebase';
import { validateImageFile } from '../utils/fileValidation';

/**
 * Custom hook for Firebase Storage operations.
 * Provides file upload with progress tracking and deletion.
 */
export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Uploads a file to Firebase Storage at the given path.
   * @param {File} file - The file to upload
   * @param {string} path - The storage path (e.g., 'photos/originals/abc.webp')
   * @returns {Promise<string>} The download URL of the uploaded file
   */
  async function uploadFile(file, path) {
    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(pct);
        },
        (error) => {
          setUploading(false);
          setProgress(0);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            setProgress(100);
            resolve(url);
          } catch (error) {
            setUploading(false);
            setProgress(0);
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Uploads an image file with validation and generates a unique storage path.
   * Validates file type and size before uploading.
   * @param {File} file - The image file to upload
   * @returns {Promise<{ url: string, storagePath: string }>} The download URL and storage path
   */
  async function uploadImage(file) {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const storagePath = `photos/originals/${id}.webp`;
    const url = await uploadFile(file, storagePath);

    return { url, storagePath };
  }

  /**
   * Deletes a file from Firebase Storage.
   * @param {string} path - The storage path of the file to delete
   * @returns {Promise<void>}
   */
  async function deleteFile(path) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  return {
    uploadFile,
    uploadImage,
    deleteFile,
    uploading,
    progress,
  };
}
