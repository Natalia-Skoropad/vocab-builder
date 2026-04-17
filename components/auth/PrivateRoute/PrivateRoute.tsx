'use client';

import type { ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';

//===============================================================

type Props = {
  children: ReactNode;
};

//===============================================================

function PrivateRoute({ children }: Props) {
  const { isAuthReady, isLoading } = useAuth();

  if (!isAuthReady || isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default PrivateRoute;
