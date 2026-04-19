'use client';

import Image from 'next/image';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

import ButtonLink from '@/components/common/Button/ButtonLink';

import css from './shared-hero.module.css';

//===========================================================================

const benefits = [
  { value: 'Track', label: 'your vocabulary progress clearly' },
  { value: 'Train', label: 'words in a simple daily flow' },
  { value: 'Build', label: 'your own personal dictionary' },
  { value: 'Practice', label: 'English step by step' },
];

//===========================================================================

function Home() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);
  const ctaHref = isAuthenticated ? ROUTES.DICTIONARY : ROUTES.LOGIN;
  const ctaLabel = isAuthenticated ? 'Go to dictionary' : 'Get started';

  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="home-title">
        <div className="container">
          <div className={css.heroFrame}>
            <div className={css.hero}>
              <div className={css.content}>
                <p className={css.kicker}>Welcome to VocabBuilder</p>

                <h1 id="home-title" className={css.title}>
                  Build your vocabulary
                  <span className={css.titleAccent}> step by step</span>
                </h1>

                <p className={css.text}>
                  Learn new words, track your progress, and train your
                  vocabulary in a calm, friendly space made for daily practice.
                </p>

                <div className={css.actions}>
                  <ButtonLink
                    href={ctaHref}
                    variant="primary"
                    fullWidth={false}
                    className={css.actionLink}
                  >
                    {ctaLabel}
                  </ButtonLink>
                </div>
              </div>

              <div className={css.imageWrap} aria-hidden="true">
                <Image
                  src="/home-page.png"
                  alt=""
                  width={568}
                  height={530}
                  priority
                  className={css.image}
                />
              </div>
            </div>
          </div>

          <ul className={css.benefits} aria-label="VocabBuilder benefits">
            {benefits.map((item) => (
              <li key={item.value} className={css.benefitItem}>
                <span className={css.benefitValue}>{item.value}</span>
                <span className={css.benefitLabel}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Home;
