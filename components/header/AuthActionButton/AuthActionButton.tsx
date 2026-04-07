'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import css from './AuthActionButton.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
};

//===============================================================

function AuthActionButton({
  label,
  icon,
  type = 'button',
  className,
  ...props
}: Props) {
  return (
    <button type={type} className={clsx(css.button, className)} {...props}>
      <span className={css.icon} aria-hidden="true">
        {icon}
      </span>

      <span className={css.label}>{label}</span>
    </button>
  );
}

export default AuthActionButton;
