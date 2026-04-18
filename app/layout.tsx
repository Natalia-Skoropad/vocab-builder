import type { Metadata } from 'next';

import AuthProvider from '@/providers/AuthProvider';
import ToastProvider from '@/providers/ToastProvider';
import TanStackProvider from '@/providers/TanStackProvider';

import Header from '@/components/header/Header/Header';

import {
  OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants/metadata';

import './globals.css';

//===============================================================

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,

  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },

  alternates: {
    canonical: '/',
  },
};

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <ToastProvider />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

export default RootLayout;
