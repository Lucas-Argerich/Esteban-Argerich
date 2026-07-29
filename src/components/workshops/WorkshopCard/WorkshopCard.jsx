import { Link } from 'react-router-dom';
import styles from './WorkshopCard.module.css';

/**
 * Formats a Firebase Timestamp or date value to a localized Spanish (Argentina) date string.
 */
function formatDate(date) {
  if (!date) return '';

  const dateObj = typeof date?.toDate === 'function'
    ? date.toDate()
    : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function WorkshopCard({ workshop }) {
  const { slug, id, title, description, date, location, coverImageUrl } = workshop;

  return (
    <Link to={`/workshops/${slug || id}`} className={styles.cardLink}>
      <article className={styles.card}>
        {coverImageUrl && (
          <img
            className={styles.coverImage}
            src={coverImageUrl}
            alt={title || 'Workshop cover'}
          />
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.meta}>
            {date && <span className={styles.date}>{formatDate(date)}</span>}
            {location && <span className={styles.location}>{location}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
