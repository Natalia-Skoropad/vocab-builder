'use client';

import AuthProvider from '@/providers/AuthProvider';
import TanStackProvider from '@/providers/TanStackProvider';
import ToastProvider from '@/providers/ToastProvider';

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function Providers({ children }: Props) {
  return (
    <TanStackProvider>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </TanStackProvider>
  );
}

export default Providers;
