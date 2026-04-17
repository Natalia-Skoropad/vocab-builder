'use client';

import type { ChangeEvent } from 'react';

import Button from '@/components/common/Button/Button';
import LanguageBadge from '@/components/common/LanguageBadge/LanguageBadge';

import type { TrainingTask } from '@/types/training';

import css from './TrainingRoom.module.css';

//===============================================================

type Props = {
  task: TrainingTask;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onSave: () => void;
  onCancel: () => void;
  showNext: boolean;
  isSubmitting?: boolean;
};

//===============================================================

function TrainingRoom({
  task,
  value,
  onChange,
  onNext,
  onSave,
  onCancel,
  showNext,
  isSubmitting = false,
}: Props) {
  const isTranslateToEnglish = task.task === 'en';

  const promptText = isTranslateToEnglish ? task.ua ?? '' : task.en ?? '';

  const answerBadge = isTranslateToEnglish
    ? { iconName: 'icon-united-kingdom-flag', label: 'English' }
    : { iconName: 'icon-ukraine-flag', label: 'Ukrainian' };

  const wordBadge = isTranslateToEnglish
    ? { iconName: 'icon-ukraine-flag', label: 'Ukrainian' }
    : { iconName: 'icon-united-kingdom-flag', label: 'English' };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={css.card}>
      <div className={css.top}>
        <div className={css.panel}>
          <div className={css.panelHeader}>
            <h2 className={css.title}>Введіть переклад</h2>
            <LanguageBadge
              iconName={answerBadge.iconName}
              label={answerBadge.label}
            />
          </div>

          <textarea
            value={value}
            onChange={handleChange}
            className={css.textarea}
            aria-label={`Translate to ${answerBadge.label}`}
            placeholder="Enter translation"
          />

          {showNext ? (
            <button
              type="button"
              className={css.nextButton}
              onClick={onNext}
              disabled={isSubmitting}
            >
              Next →
            </button>
          ) : null}
        </div>

        <div className={css.divider} />

        <div className={css.panel}>
          <div className={css.panelHeader}>
            <p className={css.word}>{promptText}</p>
            <LanguageBadge
              iconName={wordBadge.iconName}
              label={wordBadge.label}
            />
          </div>
        </div>
      </div>

      <div className={css.actions}>
        <Button
          type="button"
          variant="primary"
          onClick={onSave}
          disabled={isSubmitting}
        >
          Save
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default TrainingRoom;
