'use client';

import type { ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';

//===============================================================

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

//===============================================================

function AuthReadyGate({ children, fallback = null }: Props) {
  const { isAuthReady, isLoading } = useAuth();

  if (!isAuthReady || isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default AuthReadyGate;
