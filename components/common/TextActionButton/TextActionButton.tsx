'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './TextActionButton.module.css';

//===========================================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

//===========================================================================

function TextActionButton({
  className,
  type = 'button',
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={clsx(css.button, 'interactive-underline-trigger', className)}
      {...props}
    >
      <span
        className={clsx(
          css.text,
          'interactive-underline',
          'interactive-underline--thin'
        )}
      >
        {children}
      </span>
    </button>
  );
}

export default TextActionButton;
