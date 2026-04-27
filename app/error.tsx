'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import { ROUTES } from '@/lib/constants/routes';

import BackButton from '@/components/common/Button/BackButton';
import ButtonLink from '@/components/common/Button/ButtonLink';

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
          <div className={css.heroCard}>
            <div className={css.hero}>
              <div className={css.content}>
                <p className={css.kicker}>Error page</p>

                <h1 id="error-title" className={css.title}>
                  Something went wrong.
                </h1>

                <p className={css.text}>
                  An unexpected error occurred while loading this page. Please
                  try again later or return to the main sections of the app.
                </p>

                <div className={css.actions}>
                  <ButtonLink
                    href={ROUTES.HOME}
                    variant="primary"
                    fullWidth={false}
                    className={css.ctaButton}
                  >
                    Back to home
                  </ButtonLink>

                  <BackButton className={css.ctaButton} fullWidth={false}>
                    Go back
                  </BackButton>
                </div>
              </div>

              <div className={css.imageWrap} aria-hidden="true">
                <Image
                  src="/error-page.png"
                  alt=""
                  className={css.image}
                  width={568}
                  height={530}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;
