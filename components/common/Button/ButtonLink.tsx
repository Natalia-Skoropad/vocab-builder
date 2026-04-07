import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'common' | 'registration';
};

//===============================================================

function ButtonLink({ href, children, className, variant = 'common' }: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        css.button,
        {
          [css.common]: variant === 'common',
          [css.registration]: variant === 'registration',
        },
        className
      )}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
