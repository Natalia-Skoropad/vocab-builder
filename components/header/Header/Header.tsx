'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

import CompanyLogo from '@/components/common/CompanyLogo/CompanyLogo';
import BurgerButton from '@/components/header/BurgerButton/BurgerButton';
import LogoutButton from '@/components/header/LogoutButton/LogoutButton';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';
import HeaderAuthPlaceholder from '@/components/header/HeaderAuthPlaceholder/HeaderAuthPlaceholder';

import css from './Header.module.css';

//===========================================================================

const MobileOffcanvas = dynamic(
  () => import('@/components/header/MobileOffcanvas/MobileOffcanvas'),
  { ssr: false }
);

//===========================================================================

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isAuthReady } = useAuth();

  const isAuthenticated = Boolean(user);
  const userName = user?.name?.trim() || 'User';

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      closeMenu();

      if (
        pathname.startsWith(ROUTES.DICTIONARY) ||
        pathname.startsWith(ROUTES.RECOMMEND) ||
        pathname.startsWith(ROUTES.TRAINING)
      ) {
        router.replace(ROUTES.HOME);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className={css.header}>
      <div className={`container ${css.inner}`}>
        <CompanyLogo variant="dark" />

        {!isAuthReady ? (
          <>
            <div className={css.mobileRight}>
              <HeaderAuthPlaceholder />
            </div>

            <div className={css.desktopActions}>
              <HeaderAuthPlaceholder />
            </div>
          </>
        ) : (
          <>
            <div className={css.mobileRight}>
              {isAuthenticated ? (
                <UserBadge
                  name={userName}
                  variant="header"
                  className={css.mobileBadge}
                />
              ) : null}

              <BurgerButton onClick={openMenu} className={css.burger} />
            </div>

            {isAuthenticated ? (
              <>
                <div className={css.desktopNav}>
                  <MenuNav variant="header" mode="private" />
                </div>

                <div className={css.desktopActions}>
                  <UserBadge
                    name={userName}
                    variant="header"
                    className={css.desktopBadge}
                  />
                  <LogoutButton onClick={handleLogout} variant="header" />
                </div>
              </>
            ) : (
              <div className={css.desktopGuestActions}>
                <Link
                  href={ROUTES.LOGIN}
                  className={css.guestLink}
                  aria-label="Go to login"
                >
                  Login
                </Link>

                <span className={css.guestSep} aria-hidden="true">
                  |
                </span>

                <Link
                  href={ROUTES.REGISTER}
                  className={css.guestLink}
                  aria-label="Go to register"
                >
                  Register
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {isAuthReady ? (
        <MobileOffcanvas
          isOpen={isMenuOpen}
          onClose={closeMenu}
          isAuthenticated={isAuthenticated}
          userName={userName}
          onLogout={isAuthenticated ? handleLogout : undefined}
        />
      ) : null}
    </header>
  );
}

export default Header;
