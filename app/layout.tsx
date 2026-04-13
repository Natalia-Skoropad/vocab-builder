import type { Metadata } from 'next';

import AuthProvider from '@/providers/AuthProvider';
import TanStackProvider from '@/providers/TanStackProvider';
import ToastProvider from '@/providers/ToastProvider';

import './globals.css';

//===========================================================================

export const metadata: Metadata = {
  title: 'VocabBuilder',
  description: 'Vocabulary learning app',
};

//===========================================================================

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

export default RootLayout;
