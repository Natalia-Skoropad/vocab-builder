'use client';

import type { WordItem } from '@/types/word';

import EditWordForm from '@/components/words/EditWordForm/EditWordForm';
import WordModalShell from '@/components/modals/shared/WordModalShell';

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
    <WordModalShell
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Edit word modal"
      title="Edit word"
      text="Update the selected word and keep your personal vocabulary accurate and up to date."
    >
      <EditWordForm word={word} onClose={onClose} />
    </WordModalShell>
  );
}

export default EditWordModal;
