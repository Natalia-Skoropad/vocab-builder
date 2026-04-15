'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

import css from './CustomSelect.module.css';

//===============================================================

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'page' | 'modal';
};

//===============================================================

function CustomSelect({
  value,
  options,
  onChange,
  placeholder = 'Select',
  className,
  variant = 'page',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      ref={rootRef}
      className={clsx(
        css.root,
        variant === 'modal' && css.modalRoot,
        className
      )}
    >
      <button
        type="button"
        className={clsx(
          css.trigger,
          variant === 'modal' && css.modalTrigger,
          isOpen && css.open
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={css.triggerText}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          className={clsx(css.icon, isOpen && css.iconOpen)}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <ul
          className={clsx(css.menu, variant === 'modal' && css.modalMenu)}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={clsx(
                    css.option,
                    variant === 'modal' && css.modalOption,
                    isSelected && css.selected
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default CustomSelect;
