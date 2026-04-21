'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import css from './Button.module.css';

//===============================================================

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'light'
  | 'outlineGreen';

type LegacyDisabledVariant = 'disabled' | 'disabledAuth';

type DisabledStyle = 'default' | 'auth';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | LegacyDisabledVariant;
  disabledStyle?: DisabledStyle;
  fullWidth?: boolean;
};

//===============================================================

function Button({
  variant = 'primary',
  disabledStyle = 'default',
  className,
  type = 'button',
  children,
  disabled,
  fullWidth = true,
  ...props
}: Props) {
  const isLegacyDisabledVariant =
    variant === 'disabled' || variant === 'disabledAuth';

  const isDisabled = Boolean(disabled) || isLegacyDisabledVariant;

  const resolvedVariant: ButtonVariant =
    variant === 'disabled'
      ? 'light'
      : variant === 'disabledAuth'
      ? 'primary'
      : variant;

  const resolvedDisabledStyle: DisabledStyle =
    variant === 'disabledAuth'
      ? 'auth'
      : variant === 'disabled'
      ? 'default'
      : disabledStyle;

  return (
    <button
      type={type}
      disabled={isDisabled}
      data-disabled-style={isDisabled ? resolvedDisabledStyle : undefined}
      className={clsx(
        css.button,
        {
          [css.primary]: resolvedVariant === 'primary',
          [css.secondary]: resolvedVariant === 'secondary',
          [css.dark]: resolvedVariant === 'dark',
          [css.light]: resolvedVariant === 'light',
          [css.outlineGreen]: resolvedVariant === 'outlineGreen',
          [css.fullWidth]: fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
