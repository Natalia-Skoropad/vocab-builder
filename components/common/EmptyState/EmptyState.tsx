'use client';

import clsx from 'clsx';
import { SearchX } from 'lucide-react';

import css from './EmptyState.module.css';

//===========================================================================

type Props = {
  title: string;
  text: string;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
};

//===========================================================================

function EmptyState({
  title,
  text,
  className,
  titleClassName,
  textClassName,
}: Props) {
  return (
    <div className={clsx(css.wrapper, className)}>
      <div className={css.content}>
        <div className={css.iconWrap} aria-hidden="true">
          <SearchX className={css.icon} />
        </div>

        <h2 className={clsx(css.title, titleClassName)}>{title}</h2>
        <p className={clsx(css.text, textClassName)}>{text}</p>
      </div>
    </div>
  );
}

export default EmptyState;
