'use client';

import Button from '@/components/common/Button/Button';

import css from './WordFormActions.module.css';

//===============================================================

type Props = {
  submitLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  isSubmitDisabled?: boolean;
  isBusy?: boolean;
};

//===============================================================

function WordFormActions({
  submitLabel,
  cancelLabel = 'Cancel',
  onCancel,
  isSubmitDisabled = false,
  isBusy = false,
}: Props) {
  return (
    <div className={css.actions}>
      <Button
        type="submit"
        variant="primaryLight"
        disabled={isSubmitDisabled}
        className={css.button}
        fullWidth={false}
      >
        {submitLabel}
      </Button>

      <Button
        type="button"
        variant="secondaryLight"
        disabled={isBusy}
        onClick={onCancel}
        className={css.button}
        fullWidth={false}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}

export default WordFormActions;
