'use client';

import type { ReactNode } from 'react';

import { useBackdropClose } from '@/hooks/useBackdropClose';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

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
  useEscapeToClose({
    isActive: isOpen,
    onClose,
  });

  useBodyScrollLock(isOpen);

  const handleBackdropClick = useBackdropClose<HTMLDivElement>(onClose);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
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
