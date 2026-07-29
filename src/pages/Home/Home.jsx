import { usePageTitle } from '../../hooks/usePageTitle';
import styles from './Home.module.css';

export default function Home() {
  usePageTitle();
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-label="Hero">
        <picture>
          <source media="(min-width: 768px)" srcSet="/bg-B2.jpeg" />
          <img
            src="/bg-B4.jpeg"
            alt="Nature photography by Esteban Argerich"
            className={styles.heroImage}
          />
        </picture>
        <div className={styles.heroContent}>
          <h1 className={styles.heroName}>Esteban Argerich</h1>
          <p className={styles.heroTagline}>Fotografía de Naturaleza</p>
        </div>
      </section>
    </div>
  );
}
