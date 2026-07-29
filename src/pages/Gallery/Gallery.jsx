import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPhotos, getCategories } from '../../services/galleryService';
import { usePageTitle } from '../../hooks/usePageTitle';
import CategoryFilter from '../../components/gallery/CategoryFilter/CategoryFilter';
import MasonryGrid from '../../components/gallery/MasonryGrid/MasonryGrid';
import Lightbox from '../../components/gallery/Lightbox/Lightbox';
import styles from './Gallery.module.css';

export default function Gallery() {
  usePageTitle('Galería');
  const [allPhotos, setAllPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch all photos and categories once on mount
  useEffect(() => {
    Promise.all([getPhotos(), getCategories()])
      .then(([photosData, categoriesData]) => {
        setAllPhotos(photosData);
        setCategories(categoriesData);
      })
      .catch((err) => console.error('Failed to load gallery:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter client-side — instant, no re-fetch
  const photos = useMemo(() => {
    if (!activeCategory) return allPhotos;
    return allPhotos.filter((p) => p.category === activeCategory);
  }, [allPhotos, activeCategory]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handlePhotoClick = useCallback((_photo, index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleLightboxNavigate = useCallback((newIndex) => {
    setLightboxIndex(newIndex);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Galería</h1>
      </header>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <div className={styles.skeletonGrid} aria-label="Loading gallery">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={styles.skeletonItem}
              style={{ height: `${200 + (i % 3) * 80}px` }}
            />
          ))}
        </div>
      ) : (
        <MasonryGrid photos={photos} onPhotoClick={handlePhotoClick} />
      )}

      <Lightbox
        images={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  );
}
