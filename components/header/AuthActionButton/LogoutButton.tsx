'use client';

import { LogOut } from 'lucide-react';
import AuthActionButton from '../AuthActionButton/AuthActionButton';

//===============================================================

type Props = {
  onClick?: () => void;
  className?: string;
};

//===============================================================

function LogoutButton({ onClick, className }: Props) {
  return (
    <AuthActionButton
      label="Log out"
      icon={<LogOut size={20} strokeWidth={2.25} />}
      onClick={onClick}
      className={className}
    />
  );
}

export default LogoutButton;
