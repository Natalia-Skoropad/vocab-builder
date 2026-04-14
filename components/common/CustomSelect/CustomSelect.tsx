'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

import css from './CustomSelect.module.css';

//===============================================================

export type CustomSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
};

//===============================================================

function CustomSelect({
  value,
  options,
  onChange,
  placeholder = 'Select option',
  className,
  buttonClassName,
  dropdownClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  return (
    <div className={clsx(css.wrap, className)} ref={wrapRef}>
      <button
        type="button"
        className={clsx(
          css.trigger,
          buttonClassName,
          isOpen && css.triggerOpen
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
        <div className={clsx(css.dropdown, dropdownClassName)} role="listbox">
          <ul className={css.list}>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={clsx(
                      css.option,
                      isSelected && css.optionSelected
                    )}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default CustomSelect;
