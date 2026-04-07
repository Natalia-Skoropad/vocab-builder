'use client';

import { useEffect } from 'react';
import css from './Toast.module.css';

//===============================================================

type Props = {
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
  duration?: number;
};

//===============================================================

function Toast({ message, type = 'success', onClose, duration = 5000 }: Props) {
  useEffect(() => {
    if (!onClose) return;

    const id = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(id);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${css.toast} ${type === 'success' ? css.success : css.error}`}
    >
      <span className={css.dot} aria-hidden="true" />
      <p className={css.message}>{message}</p>
    </div>
  );
}

export default Toast;
