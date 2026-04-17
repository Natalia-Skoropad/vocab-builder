'use client';

import AddWordForm from '@/components/words/AddWordForm/AddWordForm';
import WordModalShell from '@/components/modals/shared/WordModalShell';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

//===============================================================

function AddWordModal({ isOpen, onClose }: Props) {
  return (
    <WordModalShell
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Add word modal"
      title="Add word"
      text="Adding a new word to the dictionary is an important step in enriching the language base and expanding the vocabulary."
    >
      <AddWordForm onClose={onClose} />
    </WordModalShell>
  );
}

export default AddWordModal;
