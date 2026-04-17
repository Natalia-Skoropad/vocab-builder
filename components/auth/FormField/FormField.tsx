'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './FormField.module.css';

//===============================================================

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  success?: string;
};

//===============================================================

function FormField({
  type = 'text',
  error,
  success,
  className,
  ...props
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === 'password';
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const message = error || success || ' ';

  return (
    <div className={css.wrapper}>
      <div
        className={clsx(
          css.fieldBox,
          hasError && css.fieldBoxError,
          hasSuccess && css.fieldBoxSuccess,
          className
        )}
      >
        <input
          {...props}
          type={isPasswordField && isPasswordVisible ? 'text' : type}
          className={clsx(css.input, isPasswordField && css.inputWithIcon)}
        />

        {isPasswordField ? (
          <button
            type="button"
            className={css.toggleButton}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <EyeOff className={css.toggleIcon} />
            ) : (
              <Eye className={css.toggleIcon} />
            )}
          </button>
        ) : null}
      </div>

      <span
        className={clsx(
          css.message,
          hasError && css.messageError,
          hasSuccess && css.messageSuccess,
          (hasError || hasSuccess) && css.messageVisible
        )}
      >
        {hasError || hasSuccess ? (
          <SvgIcon
            name={
              hasError ? 'icon-error-warning-fill' : 'icon-checkbox-circle-fill'
            }
            className={css.messageIcon}
            size={16}
          />
        ) : null}

        <span>{message}</span>
      </span>
    </div>
  );
}

export default FormField;
