'use client';

import Link from 'next/link';

import { ROUTES } from '@/lib/constants/routes';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './CompanyLogo.module.css';

//===============================================================

function CompanyLogo() {
  return (
    <Link href={ROUTES.HOME} className={css.logo} aria-label="Go to home">
      <SvgIcon
        name="icon-Craftwork"
        className={css.icon}
        size={40}
        title="VocabBuilder logo"
      />

      <span className={css.text}>VocabBuilder</span>
    </Link>
  );
}

export default CompanyLogo;
