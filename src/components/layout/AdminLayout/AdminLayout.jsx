import { useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <button
        className={styles.menuToggle}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Close admin menu' : 'Open admin menu'}
        aria-expanded={isSidebarOpen}
        type="button"
      >
        ☰ Menu
      </button>

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        aria-label="Admin navigation"
      >
        <h2 className={styles.sidebarTitle}>Panel Admin</h2>

        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/admin/gallery"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={closeSidebar}
            >
              Galería
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/workshops"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={closeSidebar}
            >
              Talleres
            </NavLink>
          </li>
        </ul>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          type="button"
        >
          Cerrar sesión
        </button>
      </aside>

      <section className={styles.content}>
        <Outlet />
      </section>
    </div>
  );
}
