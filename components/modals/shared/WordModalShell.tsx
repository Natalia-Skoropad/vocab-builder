'use client';

import type { ReactNode } from 'react';

import ModalBase from '@/components/modals/ModalBase/ModalBase';

import css from '@/components/modals/shared/WordModal.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  title: string;
  text: string;
  children: ReactNode;
};

//===============================================================

function WordModalShell({
  isOpen,
  onClose,
  ariaLabel,
  title,
  text,
  children,
}: Props) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} ariaLabel={ariaLabel}>
      <div className={css.content}>
        <h2 className={css.title}>{title}</h2>
        <p className={css.text}>{text}</p>
        {children}
      </div>
    </ModalBase>
  );
}

export default WordModalShell;
