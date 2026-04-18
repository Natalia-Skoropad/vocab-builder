'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { ROUTES } from '@/lib/constants/routes';

import Button from '@/components/common/Button/Button';

import css from './shared-hero.module.css';

//===========================================================================

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

//===========================================================================

function ErrorPage({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="error-title">
        <div className="container">
          <div className={css.hero}>
            <div className={css.content}>
              <p className={css.kicker}>Error page</p>

              <h1 id="error-title" className={css.title}>
                Something went wrong.
              </h1>

              <p className={css.text}>
                An unexpected error occurred while loading this page. Please try
                again later or return to the main sections of the app.
              </p>

              <div className={css.actions}>
                <Link href={ROUTES.HOME} className={css.actionLink}>
                  <Button type="button" variant="primary">
                    Back to home
                  </Button>
                </Link>

                <Link href={ROUTES.DICTIONARY} className={css.actionLink}>
                  <Button type="button" variant="secondary">
                    Go to dictionary
                  </Button>
                </Link>
              </div>
            </div>

            <div className={css.imageWrap} aria-hidden="true">
              <img
                src="/error-page.png"
                alt=""
                className={css.image}
                width={568}
                height={530}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;
