import Link from 'next/link';
import clsx from 'clsx';
import { Home } from 'lucide-react';

import css from './Breadcrumbs.module.css';

//===============================================================

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

//===============================================================

function Breadcrumbs({ items, className }: Props) {
  if (!items?.length) return null;

  return (
    <nav className={clsx(css.nav, className)} aria-label="Breadcrumbs">
      <ul className={css.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isLink = Boolean(item.href) && !isLast;

          return (
            <li key={`${item.label}-${idx}`} className={css.item}>
              {idx === 0 && item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={clsx(css.link, 'interactive-underline-trigger')}
                >
                  <Home size={16} className={css.homeIcon} aria-hidden="true" />
                  <span
                    className={clsx(
                      css.linkText,
                      'interactive-underline',
                      'interactive-underline--thin'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ) : isLink ? (
                <Link
                  href={item.href!}
                  className={clsx(css.link, 'interactive-underline-trigger')}
                >
                  <span
                    className={clsx(
                      css.linkText,
                      'interactive-underline',
                      'interactive-underline--thin'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className={css.current} aria-current="page">
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <span className={css.sep} aria-hidden="true">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumbs;
