import { useEffect } from 'react';

/**
 * Custom hook to set document title and meta description dynamically for every page.
 */
export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title.includes('Yukti') ? title : `${title} | Yukti`;
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);
}

export default usePageTitle;
