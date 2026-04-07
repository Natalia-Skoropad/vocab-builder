'use client';

import Image from 'next/image';
import Link from 'next/link';

import css from './CompanyLogo.module.css';

//===============================================================

function CompanyLogo() {
  return (
    <Link href="/" className={css.companyLogo} aria-label="Go to home page">
      <Image
        src="/logo-ukraine.svg"
        alt="LearnLingo logo"
        width={28}
        height={28}
        className={css.icon}
      />

      <span className={css.text}>LearnLingo</span>
    </Link>
  );
}

export default CompanyLogo;
