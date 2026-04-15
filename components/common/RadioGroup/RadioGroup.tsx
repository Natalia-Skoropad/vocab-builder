'use client';

import clsx from 'clsx';

import css from './RadioGroup.module.css';

//===============================================================

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  className?: string;
  optionClassName?: string;
  labelClassName?: string;
  variant?: 'default' | 'light';
  ariaLabel?: string;
};

//===============================================================

function RadioGroup({
  name,
  value,
  options,
  onChange,
  className,
  optionClassName,
  labelClassName,
  variant = 'default',
  ariaLabel,
}: Props) {
  const isLight = variant === 'light';

  return (
    <fieldset className={clsx(css.group, className)} aria-label={ariaLabel}>
      {options.map((option) => {
        const checked = option.value === value;

        return (
          <label
            key={option.value}
            className={clsx(
              css.option,
              'interactive-underline-trigger',
              isLight && css.optionLight,
              option.disabled && css.optionDisabled,
              optionClassName
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className={css.input}
            />

            <span
              className={clsx(
                css.control,
                checked && css.controlChecked,
                isLight && css.controlLight,
                checked && isLight && css.controlCheckedLight
              )}
              aria-hidden="true"
            />

            <span
              className={clsx(
                css.label,
                'interactive-underline',
                isLight && 'interactive-underline--light',
                labelClassName
              )}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default RadioGroup;
