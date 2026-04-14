'use client';

import { useEffect, useRef, useState } from 'react';
import { Ellipsis, PencilLine, Trash2 } from 'lucide-react';

import type { WordItem } from '@/types/word';

import css from './ActionsBtn.module.css';

//===============================================================

type Props = {
  word: WordItem;
  onEdit?: (word: WordItem) => void;
  onDelete?: (word: WordItem) => void;
};

//===============================================================

function ActionsBtn({ word, onEdit, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={css.wrap} ref={wrapRef}>
      <button
        type="button"
        className={css.trigger}
        aria-label="Open word actions"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Ellipsis className={css.triggerIcon} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className={css.menu} role="menu">
          <button
            type="button"
            className={css.menuItem}
            onClick={() => {
              onEdit?.(word);
              setIsOpen(false);
            }}
          >
            <PencilLine className={css.menuIcon} aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className={css.menuItem}
            onClick={() => {
              onDelete?.(word);
              setIsOpen(false);
            }}
          >
            <Trash2 className={css.menuIcon} aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ActionsBtn;
