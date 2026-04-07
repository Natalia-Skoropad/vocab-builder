'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

import css from './CloseButton.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

//===============================================================

function CloseButton({ className, label = 'Close', ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(css.btn, className)}
      aria-label={label}
      {...props}
    >
      <X className={css.icon} />
    </button>
  );
}

export default CloseButton;
