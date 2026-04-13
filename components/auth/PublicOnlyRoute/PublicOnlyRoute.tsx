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

function PublicOnlyRoute({ children }: Props) {
  const router = useRouter();
  const { isAuthReady, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      router.replace(ROUTES.DICTIONARY);
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady || isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default PublicOnlyRoute;
