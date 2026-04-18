import Link from 'next/link';

import { ROUTES } from '@/lib/constants/routes';

import Button from '@/components/common/Button/Button';

import css from './shared-hero.module.css';

//===========================================================================

function NotFound() {
  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="not-found-title">
        <div className="container">
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
                src="/404-page.png"
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

export default NotFound;
