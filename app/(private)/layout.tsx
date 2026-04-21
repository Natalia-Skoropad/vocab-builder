import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { PRIVATE_DESCRIPTION, SITE_NAME } from '@/lib/constants/metadata';

//===========================================================================

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: `%s | ${SITE_NAME}`,
  },

  description: PRIVATE_DESCRIPTION,

  robots: {
    index: false,
    follow: false,
  },
};

//===========================================================================

type Props = {
  children: ReactNode;
};

//===========================================================================

function PrivateLayout({ children }: Props) {
  return <>{children}</>;
}

export default PrivateLayout;
