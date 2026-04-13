import type { Metadata } from 'next';

import AuthProvider from '@/providers/AuthProvider';
import ToastProvider from '@/providers/ToastProvider';

import './globals.css';

//===============================================================

export const metadata: Metadata = {
  title: 'VocabBuilder',
  description: 'VocabBuilder app',
};

//===============================================================

type Props = {
  children: React.ReactNode;
};

//===============================================================

function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;
