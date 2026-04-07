'use client';

/*import { useRef } from 'react';

import type { AppUser } from '@/types/auth';
import { useAuthStore } from '@/lib/store/authStore';*/

//===============================================================

type Props = {
  children: React.ReactNode;
  /*initialUser: AppUser | null;*/
};

//===============================================================

function AuthProvider({ children /*initialUser */ }: Props) {
  /*  const initializedRef = useRef(false);
 
  if (!initializedRef.current) {
    useAuthStore.getState().hydrateAuth(initialUser);
    initializedRef.current = true;
  }*/

  return <>{children}</>;
}

export default AuthProvider;
