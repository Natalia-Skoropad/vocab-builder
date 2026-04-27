'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import Button from '@/components/common/Button/Button';

//===========================================================================

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

//===========================================================================

function BackButton({ className, onClick, children, ...props }: Props) {
  const router = useRouter();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    router.back();
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className={clsx(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export default BackButton;
