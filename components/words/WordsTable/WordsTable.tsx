'use client';

import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { WordItem } from '@/types/word';

import ProgressBar from '@/components/words/ProgressBar/ProgressBar';
import ActionsBtn from '@/components/words/ActionsBtn/ActionsBtn';
import SvgIcon from '@/components/common/SvgIcon/SvgIcon';

import css from './WordsTable.module.css';

//===============================================================

type Props = {
  variant: 'dictionary' | 'recommend';
  rows: WordItem[];
  onEdit?: (word: WordItem) => void;
  onDelete?: (word: WordItem) => void;
};

//===============================================================

const columnHelper = createColumnHelper<WordItem>();

//===============================================================

function WordsTable({ variant, rows, onEdit, onDelete }: Props) {
  const dictionaryColumns = useMemo(
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
            {info
              .getValue()
              .split(' ')
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ')}
          </span>
        ),
      }),

      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => <ProgressBar value={info.getValue()} />,
      }),

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
    ],
    [onEdit, onDelete]
  );

  const recommendColumns = useMemo(
    () => [
      columnHelper.accessor('en', {
        header: 'Word',
        cell: (info) => <span className={css.wordCell}>{info.getValue()}</span>,
      }),

      columnHelper.accessor('ua', {
        header: 'Translation',
        cell: (info) => (
          <span className={css.translationCell}>{info.getValue()}</span>
        ),
      }),

      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => <ProgressBar value={info.getValue()} />,
      }),
    ],
    []
  );

  const columns =
    variant === 'dictionary' ? dictionaryColumns : recommendColumns;

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
