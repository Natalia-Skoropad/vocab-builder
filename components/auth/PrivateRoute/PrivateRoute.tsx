'use client';

import type { ReactNode } from 'react';

import AuthReadyGate from '@/components/auth/AuthReadyGate/AuthReadyGate';

//===============================================================

type Props = {
  children: ReactNode;
};

//===============================================================

function PrivateRoute({ children }: Props) {
  return <AuthReadyGate>{children}</AuthReadyGate>;
}

export default PrivateRoute;
