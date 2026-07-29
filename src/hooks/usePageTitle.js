import { useEffect } from 'react';

const BASE_TITLE = 'Esteban Argerich — Fotografía de Naturaleza';

/**
 * Sets the document title for the current page.
 * @param {string} [title] - Page-specific title. If omitted, uses the base title.
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Esteban Argerich` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
