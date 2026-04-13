'use client';

import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function AuthProvider({ children }: Props) {
  const { initAuth, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady) {
      void initAuth();
    }
  }, [initAuth, isAuthReady]);

  return <>{children}</>;
}

export default AuthProvider;
