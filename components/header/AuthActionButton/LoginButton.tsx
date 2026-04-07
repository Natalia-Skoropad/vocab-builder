'use client';

import { LogIn } from 'lucide-react';
import AuthActionButton from '../AuthActionButton/AuthActionButton';

//===============================================================

type Props = {
  onClick?: () => void;
  className?: string;
};

//===============================================================

function LoginButton({ onClick, className }: Props) {
  return (
    <AuthActionButton
      label="Log in"
      icon={<LogIn size={20} strokeWidth={2.25} />}
      onClick={onClick}
      className={className}
    />
  );
}

export default LoginButton;
