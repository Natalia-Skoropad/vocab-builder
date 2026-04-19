'use client';

import Link from 'next/link';
import clsx from 'clsx';

import { ROUTES } from '@/lib/constants/routes';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './CompanyLogo.module.css';

//===============================================================

type Props = {
  variant?: 'dark' | 'light';
};

//===============================================================

function CompanyLogo({ variant = 'dark' }: Props) {
  const iconName =
    variant === 'light' ? 'icon-Craftwork-light' : 'icon-Craftwork';

  return (
    <Link
      href={ROUTES.HOME}
      className={clsx(css.logo, {
        [css.light]: variant === 'light',
        [css.dark]: variant === 'dark',
      })}
      aria-label="Go to home"
    >
      <SvgIcon
        name={iconName}
        className={css.icon}
        size={40}
        title="VocabBuilder logo"
      />

      <span className={css.text}>VocabBuilder</span>
    </Link>
  );
}

export default CompanyLogo;
