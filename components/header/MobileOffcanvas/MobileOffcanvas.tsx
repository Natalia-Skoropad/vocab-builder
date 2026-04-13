'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';

import CloseButton from '@/components/common/CloseButton/CloseButton';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';
import LogoutButton from '@/components/header/LogoutButton/LogoutButton';

import css from './MobileOffcanvas.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onLogout: () => void | Promise<void>;
};

//===============================================================

function MobileOffcanvas({ isOpen, onClose, userName, onLogout }: Props) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className={css.panel}>
        <div className={css.topRow}>
          <UserBadge
            name={userName}
            variant="offcanvas"
            className={css.userBadge}
          />

          <CloseButton onClick={onClose} />
        </div>

        <div className={css.content}>
          <MenuNav variant="offcanvas" onNavigate={onClose} />

          <LogoutButton
            onClick={onLogout}
            variant="offcanvas"
            className={css.logoutButton}
          />
        </div>

        <div className={css.illustrationWrap} aria-hidden="true">
          <Image
            src="/a-girl-and-a-boy-are-reading-a-book.png"
            alt=""
            fill
            className={css.illustration}
            sizes="(max-width: 767px) 180px, 220px"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}

export default MobileOffcanvas;
