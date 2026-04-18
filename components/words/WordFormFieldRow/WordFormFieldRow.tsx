'use client';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import LanguageBadge from '@/components/common/LanguageBadge/LanguageBadge';

import css from './WordFormFieldRow.module.css';

//===============================================================

export type FeedbackState = 'default' | 'success' | 'error';

type Props = {
  name: string;
  value: string;
  placeholder: string;
  iconName: string;
  languageLabel: string;
  onChange: (value: string) => void;
  state?: FeedbackState;
  errorText?: string;
  successText?: string;
  maxLength?: number;
};

//===============================================================

function WordFormFieldRow({
  name,
  value,
  placeholder,
  iconName,
  languageLabel,
  onChange,
  state = 'default',
  errorText,
  successText,
  maxLength = 60,
}: Props) {
  return (
    <div className={css.wordRow}>
      <label className={css.inputWrap}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className={css.input}
          data-state={state}
        />
      </label>

      <LanguageBadge
        iconName={iconName}
        label={languageLabel}
        className={css.langBadge}
        variant="light"
      />

      <div className={css.feedbackSlot}>
        {state === 'error' && errorText ? (
          <p className={css.feedbackError}>
            <SvgIcon
              name="icon-error-warning-fill"
              className={css.feedbackIcon}
              size={16}
            />
            <span>{errorText}</span>
          </p>
        ) : state === 'success' && successText ? (
          <p className={css.feedbackSuccess}>
            <SvgIcon
              name="icon-checkbox-circle-fill"
              className={css.feedbackIcon}
              size={16}
            />
            <span>{successText}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default WordFormFieldRow;
