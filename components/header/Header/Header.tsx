'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

import { ROUTES } from '@/lib/constants/routes';
import { useHeaderAuthActions } from '@/hooks/useHeaderAuthActions';

import CompanyLogo from '@/components/common/CompanyLogo/CompanyLogo';
import BurgerButton from '@/components/header/BurgerButton/BurgerButton';
import LogoutButton from '@/components/header/LogoutButton/LogoutButton';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';
import HeaderAuthPlaceholder from '@/components/header/HeaderAuthPlaceholder/HeaderAuthPlaceholder';
import HeaderNavPlaceholder from '@/components/header/HeaderNavPlaceholder/HeaderNavPlaceholder';

import css from './Header.module.css';

//===========================================================================

const MobileOffcanvas = dynamic(
  () => import('@/components/header/MobileOffcanvas/MobileOffcanvas'),
  { ssr: false }
);

//===========================================================================

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthReady, isAuthenticated, userName, handleLogout } =
    useHeaderAuthActions();

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={css.header}>
      <div className={`container ${css.inner}`}>
        <CompanyLogo variant="dark" />

        {!isAuthReady ? (
          <>
            <div className={css.mobileRight}>
              <BurgerButton onClick={openMenu} className={css.burger} />
            </div>

            <div className={css.desktopNav}>
              <HeaderNavPlaceholder />
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

                  <LogoutButton
                    onClick={() => void handleLogout()}
                    variant="header"
                  />
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
          onLogout={
            isAuthenticated ? () => handleLogout(() => closeMenu()) : undefined
          }
        />
      ) : null}
    </header>
  );
}

export default Header;
