'use client';

import type { ChangeEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const EN_TRAINING_REGEX = /^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*$/;
const UA_TRAINING_REGEX = /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ'`\-\s]+$/u;

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

  const title = isTranslateToEnglish
    ? 'Enter a word in English'
    : 'Enter a word in Ukrainian';

  const trimmedValue = value.trim();

  const isAnswerFormatValid =
    !trimmedValue ||
    (isTranslateToEnglish
      ? EN_TRAINING_REGEX.test(trimmedValue)
      : UA_TRAINING_REGEX.test(trimmedValue));

  const validationMessage = isTranslateToEnglish
    ? 'Enter a valid English word or phrase.'
    : 'Enter a valid Ukrainian word or phrase.';

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleNextClick = () => {
    if (trimmedValue && !isAnswerFormatValid) {
      toast.error(validationMessage);
      return;
    }

    onNext();
  };

  const handleSaveClick = () => {
    if (trimmedValue && !isAnswerFormatValid) {
      toast.error(validationMessage);
      return;
    }

    onSave();
  };

  const isNextDisabled = !showNext || isSubmitting;
  const isSaveDisabled = isSubmitting;

  return (
    <div className={css.card}>
      <div className={css.outer}>
        <div className={css.top}>
          <div className={css.panel}>
            <div className={css.panelHeader}>
              <h2 className={css.title}>{title}</h2>

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
                onClick={handleNextClick}
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
          onClick={handleSaveClick}
          disabled={isSaveDisabled}
          className={`${css.actionButton} ${css.saveButton}`}
          fullWidth={false}
        >
          Save
        </Button>

        <Button
          type="button"
          variant="outlineGreen"
          onClick={onCancel}
          disabled={isSubmitting}
          className={css.actionButton}
          fullWidth={false}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default TrainingRoom;
