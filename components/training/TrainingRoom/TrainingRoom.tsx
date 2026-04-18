'use client';

import type { ChangeEvent } from 'react';
import { ArrowRight } from 'lucide-react';

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

  const isNextDisabled = !showNext || isSubmitting;

  return (
    <div className={css.card}>
      <div className={css.outer}>
        <div className={css.top}>
          <div className={css.panel}>
            <div className={css.panelHeader}>
              <h2 className={css.title}>Enter the word</h2>

              <LanguageBadge
                iconName={answerBadge.iconName}
                label={answerBadge.label}
                variant="dark"
              />
            </div>

            <div className={css.inputWrap}>
              <textarea
                value={value}
                onChange={handleChange}
                className={css.textarea}
                aria-label={`Translate to ${answerBadge.label}`}
                placeholder="Type your answer here"
              />
            </div>

            <div className={css.nextRow}>
              <button
                type="button"
                className={`${css.nextButton} interactive-underline-trigger`}
                onClick={onNext}
                disabled={isNextDisabled}
                aria-label="Go to next word"
              >
                <span className={`${css.nextButtonText} interactive-underline`}>
                  Next
                </span>

                <ArrowRight className={css.nextButtonIcon} aria-hidden="true" />
              </button>

              {!showNext ? (
                <p className={css.nextHint}>
                  This is the last task. Press Save.
                </p>
              ) : null}
            </div>
          </div>

          <div className={css.divider} />

          <div className={css.panel}>
            <div className={css.panelHeader}>
              <p className={css.subtitle}>You are learning now</p>

              <LanguageBadge
                iconName={wordBadge.iconName}
                label={wordBadge.label}
                variant="dark"
              />
            </div>

            <p className={css.word}>{promptText}</p>
          </div>
        </div>
      </div>

      <div className={css.actions}>
        <Button
          type="button"
          variant="primary"
          onClick={onSave}
          disabled={isSubmitting}
          className={css.actionButton}
        >
          Save
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className={css.actionButton}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default TrainingRoom;
