import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'dark';
  fullWidth?: boolean;
};

//===============================================================

function ButtonLink({
  href,
  children,
  className,
  variant = 'primary',
  fullWidth = true,
}: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        css.button,
        {
          [css.primary]: variant === 'primary',
          [css.secondary]: variant === 'secondary',
          [css.dark]: variant === 'dark',
          [css.fullWidth]: fullWidth,
        },
        className
      )}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
