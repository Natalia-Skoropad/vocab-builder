'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function PrivateRoute({ children }: Props) {
  const router = useRouter();
  const { isAuthReady, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady || isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default PrivateRoute;
