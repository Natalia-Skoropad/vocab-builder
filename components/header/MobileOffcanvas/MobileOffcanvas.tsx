'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/hooks/useAuth';

import Button from '@/components/common/Button/Button';
import CloseButton from '@/components/common/CloseButton/CloseButton';
import LoginButton from '@/components/header/AuthActionButton/LoginButton';
import CompanyLogo from '@/components/header/CompanyLogo/CompanyLogo';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import LogoutButton from '@/components/header/AuthActionButton/LogoutButton';
import UserBadge from '@/components/header/UserBadge/UserBadge';

import css from './MobileOffcanvas.module.css';

//===============================================================

interface MobileOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

//===============================================================

function MobileOffcanvas({ isOpen, onClose }: MobileOffcanvasProps) {
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  const { openModal } = useModal();
  const { user, isAuthenticated, isAuthReady, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      toast.success('Logged out successfully!');

      if (pathname.startsWith('/favorites')) {
        router.replace('/');
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleOpenLoginModal = () => {
    onClose();
    openModal('login');
  };

  const handleOpenRegisterModal = () => {
    onClose();
    openModal('register');
  };

  const handleProtectedNavClick = () => {
    onClose();
    toast.error('You need to sign in to open Favorites.');
    openModal('login');
  };

  useEffect(() => {
    if (!isOpen) return;

    if (previousPathnameRef.current !== pathname) {
      onClose();
    }

    previousPathnameRef.current = pathname;
  }, [isOpen, pathname, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.panel} role="document">
        <div className={css.header}>
          <CompanyLogo />
          <CloseButton onClick={onClose} />
        </div>

        <div className={css.content}>
          <MenuNav
            isAuthenticated={isAuthenticated}
            onProtectedNavClick={handleProtectedNavClick}
          />

          <div className={css.actions}>
            {!isAuthReady ? null : isAuthenticated ? (
              <>
                <UserBadge
                  name={user?.name ?? 'User'}
                  className={css.userBadge}
                />

                <LogoutButton
                  className={css.loginButton}
                  onClick={handleLogout}
                />
              </>
            ) : (
              <>
                <LoginButton
                  className={css.loginButton}
                  onClick={handleOpenLoginModal}
                />

                <Button
                  variant="registration"
                  className={css.registrationButton}
                  onClick={handleOpenRegisterModal}
                >
                  Registration
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileOffcanvas;
