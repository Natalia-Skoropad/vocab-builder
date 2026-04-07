'use client';

import css from './UserBadge.module.css';

//===============================================================

type Props = {
  name: string;
  className?: string;
};

//===============================================================

function UserBadge({ name, className }: Props) {
  const trimmedName = name.trim() || 'User';
  const initial = trimmedName.charAt(0).toUpperCase();

  return (
    <div className={`${css.userBox} ${className ?? ''}`}>
      <div className={css.avatar} aria-hidden="true">
        {initial}
      </div>

      <span className={css.userName}>{trimmedName}</span>
    </div>
  );
}

export default UserBadge;
