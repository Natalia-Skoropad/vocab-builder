import type { AnchorHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import type { ButtonVariant } from './Button';

import css from './Button.module.css';

//===============================================================

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

//===============================================================

function ButtonLink({
  href,
  children,
  variant = 'primary',
  fullWidth = true,
  className,
  ...props
}: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        css.button,
        css.linkButton,
        css[variant],
        fullWidth && css.fullWidth,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
