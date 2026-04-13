import type { ReactNode } from 'react';

import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute/PublicOnlyRoute';
import AuthPageShell from '@/components/auth/AuthPageShell/AuthPageShell';

//===========================================================================

type Props = {
  children: ReactNode;
};

//===========================================================================

function PublicLayout({ children }: Props) {
  return (
    <PublicOnlyRoute>
      <AuthPageShell>{children}</AuthPageShell>
    </PublicOnlyRoute>
  );
}

export default PublicLayout;
