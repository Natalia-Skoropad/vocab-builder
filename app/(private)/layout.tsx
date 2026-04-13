import type { ReactNode } from 'react';

import PrivateRoute from '@/components/auth/PrivateRoute/PrivateRoute';

//===========================================================================

type Props = {
  children: ReactNode;
};

//===========================================================================

function PrivateLayout({ children }: Props) {
  return <PrivateRoute>{children}</PrivateRoute>;
}

export default PrivateLayout;
