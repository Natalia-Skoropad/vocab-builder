'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './TextActionButton.module.css';

//===========================================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

//===========================================================================

function TextActionButton({ className, type = 'button', ...props }: Props) {
  return (
    <button type={type} className={clsx(css.button, className)} {...props} />
  );
}

export default TextActionButton;
