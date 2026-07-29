import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.jsx';
import styles from './MasonryGrid.module.css';

/**
 * MasonryGrid — responsive masonry layout using CSS columns.
 * Renders photos in 1 column (< 768px), 2 columns (768–1199px),
 * or 3 columns (≥ 1200px) with a configurable gap.
 */
export default function MasonryGrid({ photos = [], onPhotoClick, gap = 16 }) {
  return (
    <div
      className={styles.grid}
      style={{ '--grid-gap': `${gap}px` }}
    >
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className={styles.gridItem}
        >
          <OptimizedImage
            src={photo.url}
            alt={photo.alt || `Photo ${index + 1}`}
            width={photo.width}
            height={photo.height}
            thumbnailSrc={photo.thumbnailUrl}
            loading="lazy"
            onClick={() => onPhotoClick?.(photo, index)}
          />
        </div>
      ))}
    </div>
  );
}
