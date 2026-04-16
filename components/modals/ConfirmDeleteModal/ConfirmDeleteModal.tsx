'use client';

import Button from '@/components/common/Button/Button';
import ModalBase from '@/components/modals/ModalBase/ModalBase';

import css from './ConfirmDeleteModal.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  wordLabel?: string;
};

//===============================================================

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  wordLabel,
}: Props) {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Confirm delete word modal"
    >
      <div className={css.content}>
        <h2 className={css.title}>Delete word</h2>

        <p className={css.text}>
          {wordLabel ? (
            <>
              Do you really want to delete the word{' '}
              <span className={css.wordLabel}>&quot;{wordLabel}&quot;</span>?
            </>
          ) : (
            'Do you really want to delete this word?'
          )}
        </p>

        <div className={css.actions}>
          <Button
            type="button"
            variant={isSubmitting ? 'disabled' : 'light'}
            className={css.confirmButton}
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className={css.cancelButton}
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ConfirmDeleteModal;
