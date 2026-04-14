'use client';

import css from './WordsPagination.module.css';

//===============================================================

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

//===============================================================

function getPages(currentPage: number, totalPages: number) {
  const pages: (number | 'dots')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push('dots');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('dots');
  }

  pages.push(totalPages);

  return pages;
}

//===============================================================

function WordsPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPages(currentPage, totalPages);

  return (
    <nav className={css.nav} aria-label="Words pagination">
      <ul className={css.list}>
        <li>
          <button
            type="button"
            className={css.button}
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            «
          </button>
        </li>

        <li>
          <button
            type="button"
            className={css.button}
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            ‹
          </button>
        </li>

        {pages.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item === 'dots' ? (
              <span className={css.dots}>...</span>
            ) : (
              <button
                type="button"
                className={`${css.button} ${
                  item === currentPage ? css.active : ''
                }`}
                onClick={() => onPageChange?.(item)}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            type="button"
            className={css.button}
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            ›
          </button>
        </li>

        <li>
          <button
            type="button"
            className={css.button}
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default WordsPagination;
