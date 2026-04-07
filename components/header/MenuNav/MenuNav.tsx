'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import css from './MenuNav.module.css';

//===============================================================

type Props = {
  isAuthenticated: boolean;
  onProtectedNavClick?: () => void;
  variant?: 'header' | 'offcanvas';
};

//===============================================================

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

//===============================================================

function MenuNav({
  isAuthenticated,
  onProtectedNavClick,
  variant = 'header',
}: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', protected: false },
    { href: '/teachers', label: 'Teachers', protected: false },
    { href: '/favorites', label: 'Favorites', protected: true },
  ];

  return (
    <nav
      className={clsx(css.menuNav, variant === 'offcanvas' && css.offcanvasNav)}
      aria-label="Primary navigation"
    >
      <ul
        className={clsx(
          css.menuList,
          variant === 'offcanvas' && css.menuListOffcanvas
        )}
      >
        {navItems.map(({ href, label, protected: isProtected }) => {
          const isLocked = isProtected && !isAuthenticated;

          return (
            <li key={href} className={css.menuItem}>
              {isLocked ? (
                <button
                  type="button"
                  className={clsx(
                    css.link,
                    css.linkButton,
                    css.linkLocked,
                    variant === 'offcanvas' && css.linkOffcanvas
                  )}
                  onClick={onProtectedNavClick}
                  aria-label={`${label} page requires authorization`}
                >
                  {label}
                </button>
              ) : (
                <Link
                  href={href}
                  className={clsx(
                    css.link,
                    variant === 'offcanvas' && css.linkOffcanvas,
                    {
                      [css.active]: isActive(pathname, href),
                    }
                  )}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MenuNav;
