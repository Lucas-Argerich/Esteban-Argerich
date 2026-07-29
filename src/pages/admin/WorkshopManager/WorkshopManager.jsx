import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useStorage } from '../../../hooks/useStorage';
import { getWorkshops } from '../../../services/workshopService';
import { validateImageFile } from '../../../utils/fileValidation';
import styles from './WorkshopManager.module.css';

const INITIAL_FORM = {
  title: '',
  description: '',
  dates: [''],
  location: '',
};

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const { uploadFile, deleteFile, uploading, progress } = useStorage();

  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkshops({ active: null });
      setWorkshops(data);
    } catch (err) {
      setError('Error al cargar los talleres.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleDateChange(index, value) {
    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[index] = value;
      return { ...prev, dates: newDates };
    });
  }

  function addDate() {
    setFormData((prev) => ({ ...prev, dates: [...prev.dates, ''] }));
  }

  function removeDate(index) {
    setFormData((prev) => {
      const newDates = prev.dates.filter((_, i) => i !== index);
      return { ...prev, dates: newDates.length > 0 ? newDates : [''] };
    });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(
          validation.error === 'FILE_TOO_LARGE'
            ? 'La imagen es demasiado grande (máx. 10MB).'
            : 'Formato no soportado. Usá JPG, PNG o WebP.'
        );
        setCoverFile(null);
        e.target.value = '';
        return;
      }
      setError('');
    }
    setCoverFile(file);
  }

  function handleGalleryFilesChange(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(
          validation.error === 'FILE_TOO_LARGE'
            ? `${file.name}: demasiado grande (máx. 10MB).`
            : `${file.name}: formato no soportado.`
        );
        setGalleryFiles([]);
        e.target.value = '';
        return;
      }
    }
    setError('');
    setGalleryFiles(files);
  }

  function openCreateForm() {
    setEditingWorkshop(null);
    setFormData(INITIAL_FORM);
    setCoverFile(null);
    setGalleryFiles([]);
    setError('');
    setUploadStatus('');
    setView('form');
  }

  function openEditForm(workshop) {
    setEditingWorkshop(workshop);
    // Convert dates array or single date to string array
    let dates = [''];
    if (workshop.dates && workshop.dates.length > 0) {
      dates = workshop.dates.map((d) =>
        typeof d?.toDate === 'function' ? d.toDate().toISOString().split('T')[0] : ''
      ).filter(Boolean);
      if (dates.length === 0) dates = [''];
    } else if (workshop.date) {
      const dateValue = typeof workshop.date?.toDate === 'function'
        ? workshop.date.toDate().toISOString().split('T')[0]
        : '';
      dates = dateValue ? [dateValue] : [''];
    }
    setFormData({
      title: workshop.title || '',
      description: workshop.description || '',
      dates,
      location: workshop.location || '',
    });
    setCoverFile(null);
    setGalleryFiles([]);
    setError('');
    setUploadStatus('');
    setView('form');
  }

  function cancelForm() {
    setView('list');
    setEditingWorkshop(null);
    setFormData(INITIAL_FORM);
    setCoverFile(null);
    setGalleryFiles([]);
    setError('');
    setUploadStatus('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    const validDates = formData.dates.filter((d) => d.trim() !== '');
    if (validDates.length === 0) {
      setError('Al menos una fecha es obligatoria.');
      return;
    }

    // On create, cover image is required
    if (!editingWorkshop && !coverFile) {
      setError('La imagen de portada es obligatoria.');
      return;
    }

    setSaving(true);

    try {
      let coverImageUrl = editingWorkshop?.coverImageUrl || '';
      let coverImagePath = editingWorkshop?.coverImagePath || '';

      // Upload cover image if a new file is selected
      if (coverFile) {
        const uuid = crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newPath = `workshops/cover-${uuid}.webp`;
        const url = await uploadFile(coverFile, newPath);

        // Delete old cover image if editing and replacing
        if (editingWorkshop && editingWorkshop.coverImagePath) {
          try {
            await deleteFile(editingWorkshop.coverImagePath);
          } catch {
            // Old image may not exist, continue
          }
        }

        coverImageUrl = url;
        coverImagePath = newPath;
      }

      const workshopData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        coverImageUrl,
        coverImagePath,
        updatedAt: Timestamp.now(),
      };

      // Save all dates as Timestamps array
      const validDates = formData.dates.filter((d) => d.trim() !== '');
      const dateTimestamps = validDates
        .map((d) => Timestamp.fromDate(new Date(d + 'T00:00:00')))
        .sort((a, b) => a.seconds - b.seconds);
      workshopData.dates = dateTimestamps;

      // Set `date` to the next upcoming date (or the last one if all past)
      const now = new Date();
      const upcomingDate = dateTimestamps.find((ts) => ts.toDate() >= now);
      workshopData.date = upcomingDate || dateTimestamps[dateTimestamps.length - 1];

      // Upload gallery images
      const existingImages = editingWorkshop?.images || [];
      const newImages = [];

      if (galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          setUploadStatus(`Subiendo imagen ${i + 1}/${galleryFiles.length}...`);
          const uuid = crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const imgPath = `workshops/gallery-${uuid}.webp`;
          const imgUrl = await uploadFile(file, imgPath);
          newImages.push({ url: imgUrl, path: imgPath });
        }
        setUploadStatus('');
      }

      workshopData.images = [...existingImages, ...newImages];

      if (editingWorkshop) {
        // Update existing
        const docRef = doc(db, 'workshops', editingWorkshop.id);
        await updateDoc(docRef, workshopData);
      } else {
        // Create new
        workshopData.active = true;
        workshopData.createdAt = Timestamp.now();
        await addDoc(collection(db, 'workshops'), workshopData);
      }

      await fetchWorkshops();
      cancelForm();
    } catch (err) {
      setError('Error al guardar el taller. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      // Delete cover image from storage
      if (deleteTarget.coverImagePath) {
        try {
          await deleteFile(deleteTarget.coverImagePath);
        } catch {
          // Image may not exist, continue with doc deletion
        }
      }

      // Delete gallery images from storage
      if (deleteTarget.images && deleteTarget.images.length > 0) {
        for (const img of deleteTarget.images) {
          try {
            await deleteFile(img.path);
          } catch {
            // Continue
          }
        }
      }

      // Delete Firestore document
      const docRef = doc(db, 'workshops', deleteTarget.id);
      await deleteDoc(docRef);

      setDeleteTarget(null);
      await fetchWorkshops();
    } catch (err) {
      setError('Error al eliminar el taller.');
    } finally {
      setSaving(false);
    }
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) return '—';
    return timestamp.toDate().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function getNextDate(workshop) {
    if (workshop.dates && workshop.dates.length > 0) {
      const now = new Date();
      const upcoming = workshop.dates
        .filter((d) => d?.toDate)
        .map((d) => d.toDate())
        .sort((a, b) => a - b)
        .find((d) => d >= now);
      if (upcoming) return upcoming;
      // All past: show the most recent one
      const sorted = workshop.dates
        .filter((d) => d?.toDate)
        .map((d) => d.toDate())
        .sort((a, b) => b - a);
      return sorted[0] || null;
    }
    return workshop.date?.toDate ? workshop.date.toDate() : null;
  }

  function formatNextDate(workshop) {
    const d = getNextDate(workshop);
    if (!d) return '—';
    return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function getDateCount(workshop) {
    if (workshop.dates && workshop.dates.length > 1) return workshop.dates.length;
    return 0;
  }

  async function handleToggleActive(workshop) {
    try {
      const docRef = doc(db, 'workshops', workshop.id);
      await updateDoc(docRef, { active: !workshop.active, updatedAt: Timestamp.now() });
      await fetchWorkshops();
    } catch (err) {
      console.error('Error toggling active:', err);
      setError('Error al cambiar el estado del taller.');
    }
  }

  async function handleRemoveImage(imageIndex) {
    if (!editingWorkshop) return;
    const confirmed = window.confirm('¿Eliminar esta imagen?');
    if (!confirmed) return;

    const img = editingWorkshop.images[imageIndex];
    try {
      // Delete from Storage
      if (img.path) {
        try { await deleteFile(img.path); } catch { /* continue */ }
      }
      // Update Firestore — remove from array
      const updatedImages = editingWorkshop.images.filter((_, i) => i !== imageIndex);
      const docRef = doc(db, 'workshops', editingWorkshop.id);
      await updateDoc(docRef, { images: updatedImages, updatedAt: Timestamp.now() });
      // Update local state
      setEditingWorkshop({ ...editingWorkshop, images: updatedImages });
    } catch (err) {
      console.error('Error removing image:', err);
      setError('Error al eliminar la imagen.');
    }
  }

  // Confirmation dialog
  if (deleteTarget) {
    return (
      <div className={styles.overlay}>
        <div className={styles.dialog}>
          <h2 className={styles.dialogTitle}>Confirmar eliminación</h2>
          <p className={styles.dialogText}>
            ¿Estás seguro de que querés eliminar el taller &quot;{deleteTarget.title}&quot;?
            Esta acción no se puede deshacer.
          </p>
          <div className={styles.dialogActions}>
            <button
              className={styles.buttonSecondary}
              onClick={() => setDeleteTarget(null)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              className={styles.buttonDanger}
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  if (view === 'form') {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Gestión de Talleres</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            {editingWorkshop ? 'Editar Taller' : 'Crear Taller'}
          </h2>

          <label className={styles.label} htmlFor="wm-title">Título</label>
          <input
            id="wm-title"
            className={styles.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título del taller"
            required
          />

          <label className={styles.label} htmlFor="wm-description">Descripción</label>
          <textarea
            id="wm-description"
            className={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descripción del taller"
          />

          <label className={styles.label}>Fechas</label>
          {formData.dates.map((dateVal, idx) => (
            <div key={idx} className={styles.dateRow}>
              <input
                className={styles.input}
                type="date"
                value={dateVal}
                onChange={(e) => handleDateChange(idx, e.target.value)}
                required={idx === 0}
              />
              {formData.dates.length > 1 && (
                <button
                  type="button"
                  className={styles.buttonDanger}
                  onClick={() => removeDate(idx)}
                  style={{ padding: '6px 10px' }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={addDate}
            style={{ alignSelf: 'flex-start', marginTop: '4px' }}
          >
            + Agregar fecha
          </button>

          <label className={styles.label} htmlFor="wm-location">Ubicación</label>
          <input
            id="wm-location"
            className={styles.input}
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ubicación del taller"
          />

          <label className={styles.label} htmlFor="wm-cover">
            Imagen de portada{editingWorkshop ? ' (opcional)' : ''}
          </label>
          <input
            id="wm-cover"
            className={styles.input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />

          <label className={styles.label} htmlFor="wm-gallery">
            Imágenes de galería (opcional, múltiples)
          </label>
          <input
            id="wm-gallery"
            className={styles.input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleGalleryFilesChange}
          />
          {galleryFiles.length > 0 && (
            <p className={styles.label}>{galleryFiles.length} imagen(es) seleccionada(s)</p>
          )}

          {editingWorkshop?.images?.length > 0 && (
            <div className={styles.existingImages}>
              <p className={styles.label}>Imágenes actuales ({editingWorkshop.images.length}):</p>
              <div className={styles.imageThumbs}>
                {editingWorkshop.images.map((img, idx) => (
                  <div key={idx} className={styles.thumbWrapper}>
                    <img src={img.url} alt={`Imagen ${idx + 1}`} className={styles.thumb} />
                    <button
                      type="button"
                      className={styles.thumbRemove}
                      onClick={() => handleRemoveImage(idx)}
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {uploadStatus && <p className={styles.label}>{uploadStatus}</p>}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              className={styles.button}
              type="submit"
              disabled={saving || uploading}
            >
              {saving || uploading ? 'Guardando...' : editingWorkshop ? 'Guardar cambios' : 'Crear taller'}
            </button>
            <button
              className={styles.buttonSecondary}
              type="button"
              onClick={cancelForm}
              disabled={saving || uploading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Gestión de Talleres</h1>

      <div className={styles.toolbar}>
        <button className={styles.button} onClick={openCreateForm}>
          Crear Taller
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.emptyState}>Cargando talleres...</p>
      ) : workshops.length === 0 ? (
        <p className={styles.emptyState}>No hay talleres cargados.</p>
      ) : (
        <div className={styles.workshopList}>
          {workshops.map((workshop) => (
            <div key={workshop.id} className={styles.workshopItem}>
              <div className={styles.workshopInfo}>
                <p className={styles.workshopTitle}>
                  {workshop.title}
                  <button
                    type="button"
                    className={`${styles.toggleBadge} ${
                      workshop.active ? styles.toggleActive : styles.toggleInactive
                    }`}
                    onClick={() => handleToggleActive(workshop)}
                    title={workshop.active ? 'Click para desactivar' : 'Click para activar'}
                  >
                    {workshop.active ? 'Activo' : 'Inactivo'}
                  </button>
                </p>
                <p className={styles.workshopMeta}>
                  {formatNextDate(workshop)}
                  {getDateCount(workshop) > 0 && ` (+${getDateCount(workshop) - 1} más)`}
                  {' — '}{workshop.location || 'Sin ubicación'}
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => openEditForm(workshop)}
                >
                  Editar
                </button>
                <button
                  className={styles.buttonDanger}
                  onClick={() => setDeleteTarget(workshop)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
