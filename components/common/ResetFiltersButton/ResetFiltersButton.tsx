'use client';

import type { ButtonHTMLAttributes } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

import css from './ResetFiltersButton.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  count: number;
  label?: string;
  variant?: 'default' | 'light';
};

//===============================================================

function ResetFiltersButton({
  count,
  label = 'Reset filters',
  variant = 'default',
  className,
  ...props
}: Props) {
  if (count <= 0) return null;

  return (
    <button
      type="button"
      className={clsx(
        css.button,
        'interactive-underline-trigger',
        variant === 'light' && css.light,
        className
      )}
      {...props}
    >
      <X className={css.icon} aria-hidden="true" />

      <span className={clsx(css.text, 'interactive-underline')}>
        {label} ({count})
      </span>
    </button>
  );
}

export default ResetFiltersButton;
