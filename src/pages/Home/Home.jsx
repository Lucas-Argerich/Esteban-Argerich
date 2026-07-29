import heroImageDesktop from './assets/bg-B2.jpeg';
import heroImageMobile from './assets/bg-B4.jpeg';
import { usePageTitle } from '../../hooks/usePageTitle';
import styles from './Home.module.css';

export default function Home() {
  usePageTitle();
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-label="Hero">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroImageDesktop} />
          <img
            src={heroImageMobile}
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
