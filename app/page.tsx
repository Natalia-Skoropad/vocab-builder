import type { Metadata } from 'next';
import Image from 'next/image';

import ButtonLink from '@/components/common/Button/ButtonLink';

import {
  HOME_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_NAME,
} from '@/lib/constants/metadata';
import { ROUTES } from '@/lib/constants/routes';

import css from './shared-hero.module.css';

//===========================================================================

export const metadata: Metadata = {
  title: `Home | ${SITE_NAME}`,
  description: HOME_DESCRIPTION,

  openGraph: {
    title: `Home | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    url: '/',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Home | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },

  alternates: {
    canonical: '/',
  },
};

//===========================================================================

function Home() {
  return (
    <main className={css.page}>
      <section className={css.section} aria-labelledby="home-title">
        <div className="container">
          <div className={css.heroCard}>
            <div className={css.hero}>
              <div className={css.content}>
                <p className={css.kicker}>Welcome to VocabBuilder</p>

                <h1 id="home-title" className={css.title}>
                  Build your vocabulary{' '}
                  <span className={css.titleAccent}>step by step</span>
                </h1>

                <p className={css.text}>
                  Learn new words, track your progress, and train your
                  vocabulary in a calm, friendly space made for daily practice.
                </p>

                <div className={css.actions}>
                  <ButtonLink
                    href={ROUTES.LOGIN}
                    variant="primary"
                    fullWidth={false}
                    className={css.ctaButton}
                  >
                    Get started
                  </ButtonLink>
                </div>
              </div>

              <div className={css.imageWrap} aria-hidden="true">
                <Image
                  src="/home-page.png"
                  alt=""
                  className={css.image}
                  width={568}
                  height={530}
                  priority
                />
              </div>
            </div>
          </div>

          <div className={css.benefits}>
            <article className={css.benefitCard}>
              <h2 className={css.benefitTitle}>Track</h2>
              <p className={css.benefitText}>
                your vocabulary progress clearly
              </p>
            </article>

            <article className={css.benefitCard}>
              <h2 className={css.benefitTitle}>Train</h2>
              <p className={css.benefitText}>words in a simple daily flow</p>
            </article>

            <article className={css.benefitCard}>
              <h2 className={css.benefitTitle}>Build</h2>
              <p className={css.benefitText}>your own personal dictionary</p>
            </article>

            <article className={css.benefitTitleWrap}>
              <h2 className={css.benefitTitle}>Practice</h2>
              <p className={css.benefitText}>English step by step</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
