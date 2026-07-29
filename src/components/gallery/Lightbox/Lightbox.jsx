import { useEffect, useRef, useCallback } from 'react';
import styles from './Lightbox.module.css';

/**
 * Full-screen lightbox for browsing gallery images.
 *
 * Props:
 *  - images: array of photo objects (must have at least `url` and `id`)
 *  - currentIndex: index of the currently displayed image
 *  - isOpen: whether the lightbox is visible
 *  - onClose: callback to close the lightbox
 *  - onNavigate: callback with new index for prev/next
 */
export default function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }) {
  const overlayRef = useRef(null);
  const touchStartX = useRef(null);

  // Navigate to previous image
  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  // Navigate to next image
  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        default:
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goPrev, goNext]);

  // Prevent body scroll and auto-focus when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus trap: auto-focus the overlay container
    if (overlayRef.current) {
      overlayRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || !images.length) return;

    const preload = (index) => {
      if (index >= 0 && index < images.length) {
        const img = new Image();
        img.src = images[index].url;
      }
    };

    preload(currentIndex - 1);
    preload(currentIndex + 1);
  }, [isOpen, currentIndex, images]);

  // Touch swipe handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      // Swiped left → next
      goNext();
    } else if (diff < -SWIPE_THRESHOLD) {
      // Swiped right → prev
      goPrev();
    }

    touchStartX.current = null;
  }, [goNext, goPrev]);

  // Don't render if not open
  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Image lightbox"
      aria-modal="true"
      onClick={(e) => {
        // Close when clicking the backdrop (not buttons or image)
        if (e.target === overlayRef.current) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        &#x2715;
      </button>

      <button
        className={`${styles.prevButton} ${!hasPrev ? styles.hidden : ''}`}
        onClick={goPrev}
        aria-label="Previous image"
        disabled={!hasPrev}
      >
        &#x2039;
      </button>

      <img
        className={styles.image}
        src={currentImage?.url}
        alt={currentImage?.title || `Photo ${currentIndex + 1}`}
        draggable={false}
      />

      <button
        className={`${styles.nextButton} ${!hasNext ? styles.hidden : ''}`}
        onClick={goNext}
        aria-label="Next image"
        disabled={!hasNext}
      >
        &#x203A;
      </button>
    </div>
  );
}
