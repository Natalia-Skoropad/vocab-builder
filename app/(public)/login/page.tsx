import type { Metadata } from 'next';

import LoginForm from '@/components/auth/LoginForm/LoginForm';
import { OG_IMAGE, OG_IMAGE_ALT, SITE_NAME } from '@/lib/constants/metadata';

import css from '../auth-page.module.css';

//===============================================================

export const metadata: Metadata = {
  title: `Login | ${SITE_NAME}`,
  description:
    'Sign in to your VocabBuilder account to continue learning and managing your vocabulary.',
  alternates: {
    canonical: '/login',
  },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: `Login | ${SITE_NAME}`,
    description:
      'Sign in to your VocabBuilder account to continue learning and managing your vocabulary.',
    url: '/login',
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
    title: `Login | ${SITE_NAME}`,
    description:
      'Sign in to your VocabBuilder account to continue learning and managing your vocabulary.',
    images: [OG_IMAGE],
  },
};

//===============================================================

function LoginPage() {
  return (
    <section className={css.card}>
      <h1 className={css.title}>Login</h1>

      <p className={css.text}>
        Please enter your login details to continue using our service:
      </p>

      <LoginForm />
    </section>
  );
}

export default LoginPage;
