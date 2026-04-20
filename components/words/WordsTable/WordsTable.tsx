'use client';

import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { WordItem } from '@/types/word';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import ActionsBtn from '@/components/words/ActionsBtn/ActionsBtn';
import ProgressBar from '@/components/words/ProgressBar/ProgressBar';

import css from './WordsTable.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  rows: WordItem[];
  onEdit?: (word: WordItem) => void;
  onDelete?: (word: WordItem) => void;
  onAddToDictionary?: (word: WordItem) => void | Promise<void>;
  addingWordId?: string | null;
};

//===============================================================

const columnHelper = createColumnHelper<WordItem>();

//===============================================================

function getSafeProgress(value: unknown): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
      ? Number(value)
      : 0;

  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(parsed, 100));
}

function formatCategory(value: string): string {
  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

//===============================================================

function WordsTable({
  variant,
  rows,
  onEdit,
  onDelete,
  onAddToDictionary,
  addingWordId,
}: Props) {
  const baseColumns = useMemo(
    () => [
      columnHelper.accessor('en', {
        header: () => (
          <div className={css.headCell}>
            <span>Word</span>
            <SvgIcon name="icon-united-kingdom-flag" className={css.flagIcon} />
          </div>
        ),
        cell: (info) => <span className={css.wordCell}>{info.getValue()}</span>,
      }),

      columnHelper.accessor('ua', {
        header: () => (
          <div className={css.headCell}>
            <span>Translation</span>
            <SvgIcon name="icon-ukraine-flag" className={css.flagIcon} />
          </div>
        ),
        cell: (info) => (
          <span className={css.translationCell}>{info.getValue()}</span>
        ),
      }),

      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className={css.categoryCell}>
            {formatCategory(info.getValue())}
          </span>
        ),
      }),

      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => (
          <ProgressBar value={getSafeProgress(info.getValue())} />
        ),
      }),
    ],
    []
  );

  const actionColumn = useMemo(
    () =>
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <ActionsBtn
            word={info.row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      }),
    [onEdit, onDelete]
  );

  const addColumn = useMemo(
    () =>
      columnHelper.display({
        id: 'add',
        header: '',
        cell: (info) => {
          const word = info.row.original;
          const isAdding = addingWordId === word._id;
          const isAlreadyInDictionary = Boolean(word.owner);
          const label = isAlreadyInDictionary
            ? 'Already in dictionary'
            : isAdding
            ? 'Adding…'
            : 'Add to dictionary';

          return (
            <button
              type="button"
              className={`${css.addButton} interactive-underline-trigger`}
              onClick={() => void onAddToDictionary?.(word)}
              disabled={isAdding || isAlreadyInDictionary}
              aria-label={label}
              title={label}
            >
              <span className={`${css.addButtonText} interactive-underline`}>
                {label}
              </span>

              <ArrowRight className={css.addButtonIcon} aria-hidden="true" />
            </button>
          );
        },
      }),
    [addingWordId, onAddToDictionary]
  );

  const columns = useMemo(
    () =>
      variant === 'dictionary'
        ? [...baseColumns, actionColumn]
        : [...baseColumns, addColumn],
    [variant, baseColumns, actionColumn, addColumn]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={css.outer}>
      <div className={css.scroll}>
        <table className={css.table}>
          <thead className={css.head}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={css.row}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={css.th}
                    data-column={header.column.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={css.row}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={css.td}
                    data-column={cell.column.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WordsTable;
