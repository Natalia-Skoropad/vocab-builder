'use client';

import clsx from 'clsx';
import Image from 'next/image';

import Button from '@/components/common/Button/Button';

import css from './EmptyState.module.css';

//===============================================================

type Props = {
  title: string;
  text: string;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

//===============================================================

function EmptyState({
  title,
  text,
  className,
  titleClassName,
  textClassName,
  imageSrc,
  imageAlt = '',
  imageWidth = 190,
  imageHeight = 190,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
}: Props) {
  return (
    <div className={clsx(css.wrapper, className)}>
      <div className={css.content}>
        <div className={css.textSide}>
          <h2 className={clsx(css.title, titleClassName)}>{title}</h2>
          <p className={clsx(css.text, textClassName)}>{text}</p>

          {primaryActionLabel || secondaryActionLabel ? (
            <div className={css.actions}>
              {primaryActionLabel ? (
                <Button
                  type="button"
                  variant="primary"
                  className={css.primaryButton}
                  onClick={onPrimaryAction}
                >
                  {primaryActionLabel}
                </Button>
              ) : null}

              {secondaryActionLabel ? (
                <Button
                  type="button"
                  variant="outlineGreen"
                  className={css.secondaryButton}
                  onClick={onSecondaryAction}
                >
                  {secondaryActionLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div className={css.imageWrap} aria-hidden="true">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className={css.image}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmptyState;
