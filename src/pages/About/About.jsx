import React from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import styles from './About.module.css';
import profilePhoto from '../../assets/facebook_1566015511278.jpg';

export default function About() {
  usePageTitle('Sobre Mí');
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        {/* Professional photograph */}
        <div className={styles.photoContainer}>
          <img
            src={profilePhoto}
            alt="Esteban Argerich, fotógrafo de naturaleza"
            className={styles.photo}
          />
        </div>

        {/* Biography and contact */}
        <div className={styles.textContent}>
          <h1 className={styles.heading}>Esteban Argerich</h1>

          <p className={styles.bio}>
            Fotógrafo de naturaleza y fauna silvestre radicado en Argentina.
            Mi inicio en la fotografía fue a los 16 años con una cámara
            analógica y un dormitorio que de noche se transformaba en
            laboratorio blanco y negro.
          </p>

          <p className={styles.bio}>
            Fue durante el año 2010 que hice la metamorfosis a fotógrafo
            digital, dedicándole más tiempo y atención a la fotografía de
            naturaleza, con especial interés en el mundo de las aves. Amante
            de la naturaleza y de las actividades al aire libre, esta
            disciplina me atrapó por completo.
          </p>

          <p className={styles.bio}>
            Miembro activo de la comisión directiva de AFONA (Asociación de
            Fotógrafos de Naturaleza de Argentina) y fotógrafo voluntario de
            Proyecto Pantano, una ONG que trabaja en la conservación del
            Ciervo de los Pantanos en el Delta del Paraná. Soy un firme
            convencido de que la fotografía es una gran herramienta para la
            conservación.
          </p>

          {/* Contact and social links */}
          <div className={styles.contactSection}>
            <h2 className={styles.contactHeading}>Contacto</h2>

            <a
              href="mailto:contacto@estebanargerich.com"
              className={styles.contactEmail}
            >
              contacto@estebanargerich.com
            </a>

            <ul className={styles.socialLinks}>
              <li>
                <a
                  href="https://www.instagram.com/argerichesteban/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <svg
                    className={styles.socialIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>@argerichesteban</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/esteban.argerich.5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <svg
                    className={styles.socialIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Esteban Argerich</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
