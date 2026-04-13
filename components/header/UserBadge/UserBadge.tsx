'use client';

import clsx from 'clsx';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './UserBadge.module.css';

//===============================================================

type Props = {
  name: string;
  className?: string;
  variant?: 'header' | 'offcanvas';
};

//===============================================================

function UserBadge({ name, className, variant = 'header' }: Props) {
  const trimmedName = name.trim() || 'User';

  return (
    <div
      className={clsx(
        css.userBadge,
        variant === 'offcanvas' && css.offcanvas,
        className
      )}
    >
      <span className={css.name}>{trimmedName}</span>

      <span className={css.avatar} aria-hidden="true">
        <SvgIcon name="icon-gridicons-user" className={css.icon} size={24} />
      </span>
    </div>
  );
}

export default UserBadge;
