'use client';

import type { CSSProperties } from 'react';

//===============================================================

type Props = {
  name: string;
  className?: string;
  title?: string;
  size?: number;
};

//===============================================================

function SvgIcon({ name, className, title, size = 16 }: Props) {
  const style = { width: size, height: size } satisfies CSSProperties;

  return (
    <svg
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}

export default SvgIcon;
