'use client';

import ModalBase from '@/components/modals/ModalBase/ModalBase';

import AddWordForm from './AddWordForm';
import css from './AddWordModal.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

//===============================================================

function AddWordModal({ isOpen, onClose }: Props) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} ariaLabel="Add word modal">
      <div className={css.content}>
        <h2 className={css.title}>Add word</h2>

        <p className={css.text}>
          Adding a new word to the dictionary is an important step in enriching
          the language base and expanding the vocabulary.
        </p>

        <AddWordForm onClose={onClose} />
      </div>
    </ModalBase>
  );
}

export default AddWordModal;
