import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getWorkshopById } from '../../services/workshopService';
import { usePageTitle } from '../../hooks/usePageTitle';
import styles from './WorkshopDetail.module.css';

function formatDate(date) {
  if (!date) return '';
  const dateObj = typeof date?.toDate === 'function' ? date.toDate() : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function WorkshopDetail() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', message: 'Hola, me interesa este taller. ¿Podrías darme más información?' });
  const [formStatus, setFormStatus] = useState(null); // 'success' | 'error' | null
  const [lightboxIndex, setLightboxIndex] = useState(-1); // -1 = closed

  usePageTitle(workshop?.title || 'Taller');

  useEffect(() => {
    async function fetchWorkshop() {
      try {
        const data = await getWorkshopById(id);
        setWorkshop(data);
      } catch (err) {
        console.error('Error fetching workshop:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshop();
  }, [id]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormStatus(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFormStatus('error');
      return;
    }

    // Save to Firestore
    const contactData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      workshopId: id,
      workshopTitle: workshop?.title || '',
      createdAt: Timestamp.now(),
    };

    addDoc(collection(db, 'contactSubmissions'), contactData).catch((err) =>
      console.error('Error saving contact:', err)
    );

    // Open WhatsApp with pre-filled message
    const whatsappNumber = '5491144966666';
    const text = encodeURIComponent(
      `Hola! Me interesa el taller "${workshop?.title || ''}".\n\nNombre: ${formData.name}\nTeléfono: ${formData.phone}\nMensaje: ${formData.message}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

    setFormStatus('success');
    setFormData({ name: '', phone: '', message: 'Hola, me interesa este taller. ¿Podrías darme más información?' });
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHero} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonText} />
          <div className={styles.skeletonTextShort} />
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Taller no encontrado.</p>
        <Link to="/workshops" className={styles.backLink}>← Volver a talleres</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {workshop.coverImageUrl && (
        <div className={styles.hero}>
          <img
            src={workshop.coverImageUrl}
            alt={workshop.title}
            className={styles.heroImage}
          />
        </div>
      )}

      <div className={styles.content}>
        <Link to="/workshops" className={styles.backLink}>← Volver a talleres</Link>

        <h1 className={styles.title}>{workshop.title}</h1>

        <div className={styles.meta}>
          {workshop.dates && workshop.dates.length > 0 ? (
            <div className={styles.metaDates}>
              <span className={styles.metaLabel}>📅 Fechas:</span>
              {workshop.dates
                .filter((d) => d?.toDate)
                .map((d) => d.toDate())
                .sort((a, b) => a - b)
                .map((d, idx) => {
                  const isUpcoming = d >= new Date();
                  return (
                    <span
                      key={idx}
                      className={`${styles.dateChip} ${isUpcoming ? styles.dateChipUpcoming : styles.dateChipPast}`}
                    >
                      {d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  );
                })}
            </div>
          ) : workshop.date ? (
            <span className={styles.metaItem}>📅 {formatDate(workshop.date)}</span>
          ) : null}
          {workshop.location && (
            <span className={styles.metaItem}>📍 {workshop.location}</span>
          )}
        </div>

        <p className={styles.description}>{workshop.description}</p>

        {/* Gallery images */}
        {workshop.images && workshop.images.length > 0 && (
          <section className={styles.gallery}>
            <h2 className={styles.galleryTitle}>Imágenes</h2>
            <div className={styles.galleryGrid}>
              {workshop.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${workshop.title} - imagen ${idx + 1}`}
                  className={styles.galleryImage}
                  loading="lazy"
                  onClick={() => setLightboxIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(idx); }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Lightbox */}
        {lightboxIndex >= 0 && workshop.images && (
          <div
            className={styles.lightboxOverlay}
            onClick={() => setLightboxIndex(-1)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setLightboxIndex(-1);
              if (e.key === 'ArrowRight' && lightboxIndex < workshop.images.length - 1) setLightboxIndex(lightboxIndex + 1);
              if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
            }}
            tabIndex={0}
            role="dialog"
            aria-label="Visor de imagen"
            ref={(el) => el && el.focus()}
          >
            <button
              className={styles.lightboxClose}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(-1); }}
              aria-label="Cerrar"
            >
              ✕
            </button>

            {lightboxIndex > 0 && (
              <button
                className={styles.lightboxPrev}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                aria-label="Anterior"
              >
                ‹
              </button>
            )}

            <img
              src={workshop.images[lightboxIndex].url}
              alt={`${workshop.title} - imagen ${lightboxIndex + 1}`}
              className={styles.lightboxImage}
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxIndex < workshop.images.length - 1 && (
              <button
                className={styles.lightboxNext}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                aria-label="Siguiente"
              >
                ›
              </button>
            )}
          </div>
        )}

        {/* Contact form */}
        <section className={styles.contactSection}>
          <h2 className={styles.contactTitle}>¿Te interesa este taller?</h2>
          <p className={styles.contactSubtitle}>
            Completá el formulario y te contactaré con más información.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formField}>
              <label htmlFor="contact-name" className={styles.label}>Nombre</label>
              <input
                id="contact-name"
                className={styles.input}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="contact-phone" className={styles.label}>Teléfono</label>
              <input
                id="contact-phone"
                className={styles.input}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="contact-message" className={styles.label}>Mensaje</label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="¿Qué te gustaría saber sobre este taller?"
                rows={5}
                required
              />
            </div>

            {formStatus === 'error' && (
              <p className={styles.formError}>Por favor completá todos los campos.</p>
            )}

            {formStatus === 'success' && (
              <p className={styles.formSuccess}>¡Se abrió WhatsApp con tu mensaje!</p>
            )}

            <button type="submit" className={styles.submitButton}>
              Enviar consulta
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
