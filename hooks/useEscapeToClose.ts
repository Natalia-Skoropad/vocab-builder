'use client';

import { useEffect } from 'react';

//===============================================================

type Options = {
  isActive: boolean;
  onClose: () => void;
};

//===============================================================

export function useEscapeToClose({ isActive, onClose }: Options) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onClose]);
}
