'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'light'
    | 'disabled'
    | 'disabledAuth'
    | 'outlineGreen';
  fullWidth?: boolean;
};

//===============================================================

function Button({
  variant = 'primary',
  className,
  type = 'button',
  children,
  disabled,
  fullWidth = true,
  ...props
}: Props) {
  const isDisabled =
    disabled || variant === 'disabled' || variant === 'disabledAuth';

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        css.button,
        {
          [css.primary]: variant === 'primary',
          [css.secondary]: variant === 'secondary',
          [css.dark]: variant === 'dark',
          [css.light]: variant === 'light',
          [css.disabled]: variant === 'disabled',
          [css.disabledAuth]: variant === 'disabledAuth',
          [css.outlineGreen]: variant === 'outlineGreen',
          [css.fullWidth]: fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
