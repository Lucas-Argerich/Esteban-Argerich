import heroImage from './assets/backgroundOne.jpg';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-label="Hero">
        <img
          src={heroImage}
          alt="Nature photography by Esteban Argerich"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroName}>Esteban Argerich</h1>
          <p className={styles.heroTagline}>Fotografía de Naturaleza</p>
        </div>
      </section>
    </div>
  );
}
