import type { ReactNode } from 'react';

import PrivateRoute from '@/components/auth/PrivateRoute/PrivateRoute';
import Header from '@/components/header/Header/Header';

//===========================================================================

type Props = {
  children: ReactNode;
};

//===========================================================================

function PrivateLayout({ children }: Props) {
  return (
    <PrivateRoute>
      <Header />
      {children}
    </PrivateRoute>
  );
}

export default PrivateLayout;
