'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';

import css from './MenuNav.module.css';

//===============================================================

type Variant = 'header' | 'offcanvas';

type Props = {
  variant?: Variant;
  onNavigate?: () => void;
};

//===============================================================

const navItems = [
  { href: ROUTES.DICTIONARY, label: 'Dictionary' },
  { href: ROUTES.RECOMMEND, label: 'Recommend' },
  { href: ROUTES.TRAINING, label: 'Training' },
];

//===============================================================

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

//===============================================================

function MenuNav({ variant = 'header', onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={clsx(css.nav, variant === 'offcanvas' && css.navOffcanvas)}
      aria-label="Primary navigation"
    >
      <ul
        className={clsx(css.list, variant === 'offcanvas' && css.listOffcanvas)}
      >
        {navItems.map(({ href, label }) => {
          const active = isActive(pathname, href);

          return (
            <li key={href} className={css.item}>
              <Link
                href={href}
                onClick={onNavigate}
                className={clsx(
                  css.link,
                  'interactive-underline-trigger',
                  variant === 'offcanvas' && css.linkOffcanvas,
                  active && css.active
                )}
              >
                <span
                  className={clsx(
                    css.label,
                    'interactive-underline',
                    variant === 'offcanvas' && 'interactive-underline--light'
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MenuNav;
