'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';

import Button from '@/components/common/Button/Button';
import CompanyLogo from '@/components/header/CompanyLogo/CompanyLogo';
import LoginButton from '@/components/header/AuthActionButton/LoginButton';
import LogoutButton from '@/components/header/AuthActionButton/LogoutButton';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';

import css from './Header.module.css';

//===============================================================

const MobileOffcanvas = dynamic(
  () => import('@/components/header/MobileOffcanvas/MobileOffcanvas'),
  {
    ssr: false,
  }
);

//===============================================================

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { openModal } = useModal();
  const { user, isAuthenticated, isAuthReady, logout } = useAuth();

  const openMenu = () => setIsMobileMenuOpen(true);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleOpenLoginModal = () => {
    openModal('login');
  };

  const handleOpenRegisterModal = () => {
    openModal('register');
  };

  const handleProtectedNavClick = () => {
    toast.error('You need to sign in to open Favorites.');
    openModal('login');
  };

  const handleLogout = async () => {
    try {
      await logout();
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={css.header}>
      <div className={`container ${css.inner}`}>
        <CompanyLogo />

        <button
          type="button"
          onClick={openMenu}
          aria-label="Open navigation menu"
          className={css.menuToggle}
        >
          <Menu className={css.menuIcon} />
        </button>

        <div className={css.desktopNav}>
          <MenuNav
            isAuthenticated={isAuthenticated}
            onProtectedNavClick={handleProtectedNavClick}
            variant="offcanvas"
          />
        </div>

        <div className={css.desktopActions}>
          {!isAuthReady ? (
            <div className={css.actionsPlaceholder} aria-hidden="true" />
          ) : isAuthenticated ? (
            <>
              <UserBadge name={user?.name ?? 'User'} />
              <LogoutButton onClick={handleLogout} />
            </>
          ) : (
            <>
              <LoginButton onClick={handleOpenLoginModal} />

              <Button
                variant="registration"
                className={css.registrationBtn}
                onClick={handleOpenRegisterModal}
              >
                Registration
              </Button>
            </>
          )}
        </div>

        {isMobileMenuOpen ? (
          <MobileOffcanvas isOpen={isMobileMenuOpen} onClose={closeMenu} />
        ) : null}
      </div>
    </header>
  );
}

export default Header;
