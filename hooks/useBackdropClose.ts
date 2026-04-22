'use client';

import { useCallback } from 'react';

//===============================================================

export function useBackdropClose<T extends HTMLElement>(onClose: () => void) {
  return useCallback(
    (event: React.MouseEvent<T>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );
}
