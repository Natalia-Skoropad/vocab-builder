'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './LogoutButton.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  variant?: 'header' | 'offcanvas';
};

//===============================================================

function LogoutButton({
  className,
  label = 'Log out',
  variant = 'header',
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        css.button,
        'interactive-underline-trigger',
        variant === 'offcanvas' && css.offcanvas,
        className
      )}
      aria-label={label}
      {...props}
    >
      <span
        className={clsx(
          css.text,
          'interactive-underline',
          variant === 'offcanvas' && 'interactive-underline--light'
        )}
      >
        {label}
      </span>

      <span className={css.arrow} aria-hidden="true">
        →
      </span>
    </button>
  );
}

export default LogoutButton;
