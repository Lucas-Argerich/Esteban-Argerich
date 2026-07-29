import styles from './CategoryFilter.module.css';

/**
 * CategoryFilter — renders a horizontally scrollable row of filter buttons.
 *
 * @param {Object} props
 * @param {string[]} props.categories - list of category names
 * @param {string|null} props.activeCategory - currently selected category (null = All)
 * @param {function} props.onCategoryChange - callback with category string or null
 */
export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className={styles.filterContainer} role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`${styles.filterButton} ${activeCategory === null ? styles.filterButtonActive : ''}`}
        onClick={() => onCategoryChange(null)}
        aria-pressed={activeCategory === null}
      >
        Todas
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.filterButton} ${activeCategory === category ? styles.filterButtonActive : ''}`}
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
