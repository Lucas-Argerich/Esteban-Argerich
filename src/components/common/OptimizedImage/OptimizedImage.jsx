import { useState, useCallback } from 'react';
import styles from './OptimizedImage.module.css';

/**
 * OptimizedImage — progressive loading with blur-up effect.
 * Displays a blurred placeholder (thumbnail or gradient) then fades
 * in the full-resolution image once loaded.
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  thumbnailSrc,
  loading = 'lazy',
  className,
  onClick,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Maintain aspect ratio if width/height provided, default to 4:3 if not
  const containerStyle = width && height
    ? { aspectRatio: `${width} / ${height}` }
    : { aspectRatio: '4 / 3' };

  return (
    <div
      className={`${styles.container} ${className || ''}`}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
    >
      {/* Placeholder — blurred thumbnail or gradient */}
      <div
        className={`${styles.placeholder} ${isLoaded ? styles.placeholderHidden : ''}`}
        aria-hidden="true"
      >
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt=""
            className={styles.placeholderImage}
          />
        ) : (
          <div className={styles.placeholderGradient} />
        )}
      </div>

      {/* Main image with lazy loading */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
        className={`${styles.image} ${isLoaded ? styles.imageLoaded : ''}`}
      />
    </div>
  );
}
