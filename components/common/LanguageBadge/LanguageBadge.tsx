'use client';

import clsx from 'clsx';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './LanguageBadge.module.css';

//===============================================================

type Props = {
  iconName: string;
  label: string;
  className?: string;
  variant?: 'light' | 'dark';
};

//===============================================================

function LanguageBadge({
  iconName,
  label,
  className,
  variant = 'light',
}: Props) {
  return (
    <div className={clsx(css.badge, css[variant], className)}>
      <SvgIcon name={iconName} className={css.flag} size={28} />
      <span className={css.label}>{label}</span>
    </div>
  );
}

export default LanguageBadge;
