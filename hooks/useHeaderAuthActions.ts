'use client';

import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

//===============================================================

function isPrivatePath(pathname: string) {
  return (
    pathname.startsWith(ROUTES.DICTIONARY) ||
    pathname.startsWith(ROUTES.RECOMMEND) ||
    pathname.startsWith(ROUTES.TRAINING)
  );
}

//===============================================================

export function useHeaderAuthActions() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isAuthReady } = useAuth();

  const isAuthenticated = Boolean(user);
  const userName = user?.name?.trim() || 'User';

  const handleLogout = async (onAfterLogout?: () => void) => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      onAfterLogout?.();

      if (isPrivatePath(pathname)) {
        router.replace(ROUTES.HOME);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return {
    user,
    isAuthReady,
    isAuthenticated,
    userName,
    handleLogout,
  };
}
