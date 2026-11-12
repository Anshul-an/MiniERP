import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title + ' — MiniERP';
    return () => {
      document.title = 'MiniERP';
    };
  }, [title]);
}
// add title to browser tab
