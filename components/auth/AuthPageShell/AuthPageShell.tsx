import type { ReactNode } from 'react';
import Image from 'next/image';

import CompanyLogo from '@/components/common/CompanyLogo/CompanyLogo';

import css from './AuthPageShell.module.css';

//===============================================================

type Props = {
  children: ReactNode;
};

//===============================================================

function AuthPageShell({ children }: Props) {
  return (
    <div className={css.page}>
      <div className={css.shell}>
        <header className={css.header}>
          <CompanyLogo />
        </header>

        <div className={css.content}>
          <aside className={css.visualSide} aria-hidden="true">
            <div className={css.imageWrap}>
              <Image
                src="/a-girl-and-a-boy-are-reading-a-book.png"
                alt=""
                width={498}
                height={435}
                priority
                className={css.image}
              />
            </div>

            <p className={css.caption}>
              Word · Translation · Grammar · Progress
            </p>
          </aside>

          <div className={css.formSide}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthPageShell;
