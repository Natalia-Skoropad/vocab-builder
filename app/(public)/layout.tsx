import type { Metadata } from 'next';

import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute/PublicOnlyRoute';
import AuthPageShell from '@/components/auth/AuthPageShell/AuthPageShell';

import {
  AUTH_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_NAME,
} from '@/lib/constants/metadata';

//===============================================================

export const metadata: Metadata = {
  title: 'Authentication',
  description: AUTH_DESCRIPTION,

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: `Authentication | ${SITE_NAME}`,
    description: AUTH_DESCRIPTION,
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
    title: `Authentication | ${SITE_NAME}`,
    description: AUTH_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function PublicLayout({ children }: Props) {
  return (
    <PublicOnlyRoute>
      <AuthPageShell>{children}</AuthPageShell>
    </PublicOnlyRoute>
  );
}

export default PublicLayout;
