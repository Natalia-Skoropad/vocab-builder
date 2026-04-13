'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './BurgerButton.module.css';

//===============================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

//===============================================================

function BurgerButton({
  className,
  label = 'Open navigation menu',
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={clsx(css.btn, className)}
      aria-label={label}
      {...props}
    >
      <SvgIcon name="icon-burger-menu" className={css.icon} size={40} />
    </button>
  );
}

export default BurgerButton;
