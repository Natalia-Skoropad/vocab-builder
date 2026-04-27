'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

import css from './AuthPageShell.module.css';

//===============================================================

type Props = {
  children: ReactNode;
};

//===============================================================

function AuthPageShell({ children }: Props) {
  const pathname = usePathname();

  const isRegisterPage = pathname === '/register';
  const isLoginPage = pathname === '/login';

  const breadcrumbItems = isRegisterPage
    ? [{ label: 'Home', href: '/' }, { label: 'Register' }]
    : isLoginPage
    ? [{ label: 'Home', href: '/' }, { label: 'Login' }]
    : null;

  return (
    <main className={css.page}>
      <div className={`container ${css.shell}`}>
        {breadcrumbItems ? <Breadcrumbs items={breadcrumbItems} /> : null}

        <div className={clsx(css.content, isRegisterPage && css.isRegister)}>
          <aside className={css.visualSide} aria-hidden="true">
            <div className={css.imageWrap}>
              <Image
                src="/a-girl-and-a-boy-are-reading-a-book.png"
                alt=""
                width={498}
                height={435}
                priority
                fetchPriority="high"
                className={css.image}
              />
            </div>

            <p className={css.visualCaption}>
              Word · Translation · Grammar · Progress
            </p>
          </aside>

          <div className={css.formSide}>
            {children}

            <p className={css.formCaption}>
              Word · Translation · Grammar · Progress
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPageShell;
