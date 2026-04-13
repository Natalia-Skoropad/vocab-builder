'use client';

import { createContext, useMemo, useState } from 'react';

//===========================================================================

type User = {
  name: string;
  email?: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  logout: () => Promise<void>;
};

//===========================================================================

export const AuthContext = createContext<AuthContextValue | null>(null);

//===========================================================================

type Props = {
  children: React.ReactNode;
};

//===========================================================================

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>({
    name: 'Iryna',
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthReady: true,
      logout: async () => {
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
