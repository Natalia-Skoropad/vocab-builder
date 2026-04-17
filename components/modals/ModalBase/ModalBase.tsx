'use client';

import { useEffect, type ReactNode } from 'react';

import CloseButton from '@/components/common/CloseButton/CloseButton';

import css from './ModalBase.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
};

//===============================================================

function ModalBase({ isOpen, onClose, children, ariaLabel }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className={css.modal}>
        <CloseButton onClick={onClose} className={css.closeButton} />
        {children}
      </div>
    </div>
  );
}

export default ModalBase;
