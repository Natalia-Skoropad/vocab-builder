'use client';

import Link from 'next/link';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

import Button from '@/components/common/Button/Button';

import css from './shared-hero.module.css';

//===========================================================================

function Home() {
  const { user, isAuthReady } = useAuth();

  const isAuthenticated = Boolean(user);
  const ctaHref = isAuthenticated ? ROUTES.DICTIONARY : ROUTES.LOGIN;
  const ctaLabel = isAuthenticated ? 'Go to dictionary' : 'Get started';

  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="home-title">
        <div className="container">
          <div className={css.hero}>
            <div className={css.content}>
              <p className={css.kicker}>Welcome to VocabBuilder</p>

              <h1 id="home-title" className={css.title}>
                Build your vocabulary step by step.
              </h1>

              <p className={css.text}>
                Learn new words, track your progress, and train your vocabulary
                in a simple and friendly space made for daily practice.
              </p>

              <div className={css.actions}>
                <Link href={ctaHref} className={css.actionLink}>
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth={false}
                    disabled={!isAuthReady}
                  >
                    {ctaLabel}
                  </Button>
                </Link>
              </div>
            </div>

            <div className={css.imageWrap} aria-hidden="true">
              <img
                src="/home-page.png"
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

export default Home;
