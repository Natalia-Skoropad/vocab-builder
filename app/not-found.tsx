import type { Metadata } from 'next';
import Image from 'next/image';

import { ROUTES } from '@/lib/constants/routes';

import ButtonLink from '@/components/common/Button/ButtonLink';

import css from './shared-hero.module.css';

//===========================================================================

export const metadata: Metadata = {
  title: '404',
  description: 'The page you are looking for could not be found.',
};

//===========================================================================

function NotFound() {
  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="not-found-title">
        <div className="container">
          <div className={css.heroCard}>
            <div className={css.hero}>
              <div className={css.content}>
                <p className={css.kicker}>404 page</p>

                <h1 id="not-found-title" className={css.title}>
                  Oops! This page seems to be missing.
                </h1>

                <p className={css.text}>
                  The page you are looking for may have been moved, deleted, or
                  never existed. Let’s get you back to a safe place.
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
                </div>
              </div>

              <div className={css.imageWrap} aria-hidden="true">
                <Image
                  src="/404-page.png"
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

export default NotFound;
