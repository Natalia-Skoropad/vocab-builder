'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

import AuthReadyGate from '@/components/auth/AuthReadyGate/AuthReadyGate';

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function PublicOnlyRoute({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.DICTIONARY);
    }
  }, [isAuthenticated, router]);

  return <AuthReadyGate>{isAuthenticated ? null : children}</AuthReadyGate>;
}

export default PublicOnlyRoute;
