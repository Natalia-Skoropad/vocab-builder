import type { Metadata } from 'next';

import RegisterForm from '@/components/auth/RegisterForm/RegisterForm';

import { OG_IMAGE, OG_IMAGE_ALT, SITE_NAME } from '@/lib/constants/metadata';

import css from '../auth-page.module.css';

//===============================================================

export const metadata: Metadata = {
  title: `Register | ${SITE_NAME}`,
  description:
    'Create your VocabBuilder account and start building your personal vocabulary learning space.',
  alternates: {
    canonical: '/register',
  },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: `Register | ${SITE_NAME}`,
    description:
      'Create your VocabBuilder account and start building your personal vocabulary learning space.',
    url: '/register',
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
    title: `Register | ${SITE_NAME}`,
    description:
      'Create your VocabBuilder account and start building your personal vocabulary learning space.',
    images: [OG_IMAGE],
  },
};

//===============================================================

function RegisterPage() {
  return (
    <section className={css.card}>
      <h1 className={css.title}>Register</h1>

      <p className={css.text}>
        To start using our services, please fill out the registration form
        below. All fields are mandatory:
      </p>

      <RegisterForm />
    </section>
  );
}

export default RegisterPage;
