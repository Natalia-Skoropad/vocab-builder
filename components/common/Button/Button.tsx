'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

export type ButtonVariant =
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'secondaryLight';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

//===============================================================

function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={clsx(
        css.button,
        css[variant],
        fullWidth && css.fullWidth,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
