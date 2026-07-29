import { useState, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../../assets/Esteban-Argerich-black-high-res.png';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Galería' },
  { to: '/workshops', label: 'Workshops' },
  { to: '/about', label: 'Sobre mí' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <img
            src={logo}
            alt="Esteban Argerich"
            className={styles.logo}
          />
        </Link>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span className={`${styles.hamburgerBar} ${isMenuOpen ? styles.hamburgerBarOpen : ''}`} />
          <span className={`${styles.hamburgerBar} ${isMenuOpen ? styles.hamburgerBarOpen : ''}`} />
          <span className={`${styles.hamburgerBar} ${isMenuOpen ? styles.hamburgerBarOpen : ''}`} />
        </button>

        <nav
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
          aria-label="Main navigation"
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to} className={styles.navItem}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                  onClick={closeMenu}
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
