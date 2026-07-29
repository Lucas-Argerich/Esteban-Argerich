import { useState, useEffect } from 'react';
import { getWorkshops } from '../../services/workshopService';
import { usePageTitle } from '../../hooks/usePageTitle';
import WorkshopCard from '../../components/workshops/WorkshopCard/WorkshopCard';
import styles from './Workshops.module.css';

export default function Workshops() {
  usePageTitle('Talleres');
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const data = await getWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshops();
  }, []);

  if (loading) {
    return (
      <section className={styles.page}>
        <h1 className={styles.header}>Talleres</h1>
        <div className={styles.skeletonGrid} aria-label="Cargando talleres">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonTextShort} />
                <div className={styles.skeletonMeta} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.header}>Talleres</h1>

      {workshops.length === 0 ? (
        <p className={styles.emptyMessage}>
          No hay talleres programados actualmente.
        </p>
      ) : (
        <div className={styles.grid}>
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}
    </section>
  );
}
