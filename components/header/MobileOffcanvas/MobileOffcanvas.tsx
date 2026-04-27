'use client';

import Image from 'next/image';

import { useBackdropClose } from '@/hooks/useBackdropClose';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';

import CloseButton from '@/components/common/CloseButton/CloseButton';
import CompanyLogo from '@/components/common/CompanyLogo/CompanyLogo';
import MenuNav from '@/components/header/MenuNav/MenuNav';
import UserBadge from '@/components/header/UserBadge/UserBadge';
import LogoutButton from '@/components/header/LogoutButton/LogoutButton';

import css from './MobileOffcanvas.module.css';

//===============================================================

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userName?: string;
  onLogout?: () => void | Promise<void>;
};

//===============================================================

function MobileOffcanvas({
  isOpen,
  onClose,
  isAuthenticated,
  userName = 'User',
  onLogout,
}: Props) {
  useEscapeToClose({
    isActive: isOpen,
    onClose,
  });

  useBodyScrollLock(isOpen);

  const handleBackdropClick = useBackdropClose<HTMLDivElement>(onClose);

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
          {isAuthenticated ? (
            <UserBadge
              name={userName}
              variant="offcanvas"
              className={css.userBadge}
            />
          ) : (
            <CompanyLogo variant="light" />
          )}

          <CloseButton onClick={onClose} />
        </div>

        <div className={css.content}>
          <MenuNav
            variant="offcanvas"
            mode={isAuthenticated ? 'private' : 'public'}
            onNavigate={onClose}
          />

          {isAuthenticated ? (
            <LogoutButton
              onClick={onLogout}
              variant="offcanvas"
              className={css.logoutButton}
            />
          ) : null}
        </div>

        <div className={css.illustrationWrap} aria-hidden="true">
          <Image
            src="/a-girl-and-a-boy-are-reading-a-book.png"
            alt=""
            fill
            className={css.illustration}
            sizes="(max-width: 767px) 180px, 220px"
            priority={false}
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
}

export default MobileOffcanvas;
