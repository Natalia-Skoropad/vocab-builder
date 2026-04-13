'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/useAuth';

import BurgerButton from '@/components/header/BurgerButton/BurgerButton';
import CompanyLogo from '@/components/common/CompanyLogo/CompanyLogo';
import LogoutButton from '@/components/header/LogoutButton/LogoutButton';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';

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

  const { user, logout } = useAuth();

  const userName = user?.name?.trim() || 'User';

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');

      if (pathname.startsWith(ROUTES.DICTIONARY)) {
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
        <CompanyLogo />

        <div className={css.mobileRight}>
          <UserBadge name={userName} variant="header" />
          <BurgerButton onClick={openMenu} className={css.burger} />
        </div>

        <div className={css.desktopNav}>
          <MenuNav variant="header" />
        </div>

        <div className={css.desktopActions}>
          <UserBadge name={userName} variant="header" />
          <LogoutButton onClick={handleLogout} variant="header" />
        </div>
      </div>

      <MobileOffcanvas
        isOpen={isMenuOpen}
        onClose={closeMenu}
        userName={userName}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default Header;
