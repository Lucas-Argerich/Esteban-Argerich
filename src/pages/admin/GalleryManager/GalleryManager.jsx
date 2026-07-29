import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useStorage } from '../../../hooks/useStorage';
import { getPhotos, getCategories } from '../../../services/galleryService';
import { validateImageFile } from '../../../utils/fileValidation';
import styles from './GalleryManager.module.css';

export default function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editNewCategory, setEditNewCategory] = useState('');
  const fileInputRef = useRef(null);

  const { uploadImage, deleteFile } = useStorage();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [photosData, categoriesData] = await Promise.all([
        getPhotos(),
        getCategories(),
      ]);
      setPhotos(photosData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleFileChange(e) {
    setError('');
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }

  function getCategoryValue() {
    if (selectedCategory === '__new__') {
      return newCategory.trim();
    }
    return selectedCategory;
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    const category = getCategoryValue();

    // Validate all files first
    const invalidFiles = [];
    for (const file of selectedFiles) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        invalidFiles.push({ name: file.name, error: validation.error });
      }
    }

    if (invalidFiles.length > 0) {
      const messages = invalidFiles.map((f) => {
        if (f.error === 'UNSUPPORTED_FORMAT') return `${f.name}: formato no soportado`;
        if (f.error === 'FILE_TOO_LARGE') return `${f.name}: excede 10MB`;
        return `${f.name}: error de validación`;
      });
      setError(`Archivos inválidos:\n${messages.join('\n')}`);
      return;
    }

    setError('');
    setIsBulkUploading(true);
    setBulkProgress({ current: 0, total: selectedFiles.length, fileName: '' });

    let successCount = 0;
    const errors = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setBulkProgress({ current: i + 1, total: selectedFiles.length, fileName: file.name });

      try {
        const { url, storagePath } = await uploadImage(file);

        const photoData = {
          url,
          storagePath,
          uploadedAt: Timestamp.now(),
          width: null,
          height: null,
        };

        if (category) {
          photoData.category = category;
        }

        await addDoc(collection(db, 'photos'), photoData);
        successCount++;
      } catch (err) {
        console.error(`Upload error for ${file.name}:`, err);
        errors.push(file.name);
      }
    }

    setIsBulkUploading(false);
    setBulkProgress({ current: 0, total: 0, fileName: '' });
    setSelectedFiles([]);
    setSelectedCategory('');
    setNewCategory('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (errors.length > 0) {
      setError(`${successCount} subidas exitosas. Fallaron: ${errors.join(', ')}`);
    }

    await fetchData();
  }

  async function handleDelete(photo) {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    try {
      await deleteFile(photo.storagePath);
      await deleteDoc(doc(db, 'photos', photo.id));
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error al eliminar la imagen. Intente nuevamente.');
    }
  }

  function startEditCategory(photo) {
    setEditingPhoto(photo.id);
    setEditCategory(photo.category || '');
    setEditNewCategory('');
  }

  function cancelEditCategory() {
    setEditingPhoto(null);
    setEditCategory('');
    setEditNewCategory('');
  }

  async function saveEditCategory(photoId) {
    let category;
    if (editCategory === '__new__') {
      category = editNewCategory.trim();
    } else {
      category = editCategory;
    }

    try {
      const docRef = doc(db, 'photos', photoId);
      await updateDoc(docRef, { category: category || null });
      setEditingPhoto(null);
      setEditCategory('');
      setEditNewCategory('');
      await fetchData();
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Error al actualizar la categoría.');
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Gestión de Galería</h1>

      <div className={styles.uploadSection}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
        />

        <div className={styles.categorySelect}>
          <label className={styles.categoryLabel}>Categoría:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="__new__">+ Nueva categoría...</option>
          </select>
          {selectedCategory === '__new__' && (
            <input
              type="text"
              placeholder="Nombre de la nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={styles.categoryInput}
            />
          )}
        </div>

        <button onClick={handleUpload} disabled={selectedFiles.length === 0 || isBulkUploading}>
          {isBulkUploading
            ? `Subiendo ${bulkProgress.current}/${bulkProgress.total}...`
            : selectedFiles.length > 1
              ? `Subir ${selectedFiles.length} imágenes`
              : 'Subir imagen'}
        </button>

        {isBulkUploading && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
            />
          </div>
        )}

        {isBulkUploading && bulkProgress.fileName && (
          <p className={styles.progressText}>
            Subiendo: {bulkProgress.fileName}
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando imágenes...</p>
      ) : photos.length === 0 ? (
        <p className={styles.empty}>No hay imágenes en la galería.</p>
      ) : (
        <div className={styles.grid}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.imageCard}>
              <img src={photo.url} alt={photo.category || 'Foto de galería'} loading="lazy" />

              <div className={styles.cardOverlay}>
                {editingPhoto === photo.id ? (
                  <div className={styles.editCategoryForm}>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className={styles.editSelect}
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Nueva...</option>
                    </select>
                    {editCategory === '__new__' && (
                      <input
                        type="text"
                        placeholder="Nueva categoría"
                        value={editNewCategory}
                        onChange={(e) => setEditNewCategory(e.target.value)}
                        className={styles.editInput}
                      />
                    )}
                    <div className={styles.editActions}>
                      <button onClick={() => saveEditCategory(photo.id)} className={styles.saveBtn}>✓</button>
                      <button onClick={cancelEditCategory} className={styles.cancelBtn}>✕</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.cardActions}>
                    <span
                      className={styles.categoryBadge}
                      onClick={() => startEditCategory(photo)}
                      title="Editar categoría"
                    >
                      {photo.category || 'Sin categoría'}
                    </span>
                    <button onClick={() => handleDelete(photo)} className={styles.deleteBtn}>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
