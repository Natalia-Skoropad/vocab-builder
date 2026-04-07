'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'common' | 'registration' | 'disabled';
};

//===============================================================

function Button({
  variant = 'common',
  className,
  type = 'button',
  children,
  disabled,
  ...props
}: Props) {
  const isDisabled = disabled || variant === 'disabled';

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        css.button,
        {
          [css.common]: variant === 'common',
          [css.registration]: variant === 'registration',
          [css.disabled]: variant === 'disabled',
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
