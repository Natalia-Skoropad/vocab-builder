'use client';

import type { WordItem } from '@/types/word';

import ModalBase from '@/components/modals/ModalBase/ModalBase';
import EditWordForm from './EditWordForm';

import css from '@/components/modals/shared/WordModal.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  word: WordItem | null;
  onClose: () => void;
};

//===============================================================

function EditWordModal({ isOpen, word, onClose }: Props) {
  if (!word) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} ariaLabel="Edit word modal">
      <div className={css.content}>
        <h2 className={css.title}>Edit word</h2>

        <p className={css.text}>
          Update the selected word and keep your personal vocabulary accurate
          and up to date.
        </p>

        <EditWordForm word={word} onClose={onClose} />
      </div>
    </ModalBase>
  );
}

export default EditWordModal;
