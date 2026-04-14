'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { WordItem } from '@/types/word';

import ProgressBar from '@/components/words/ProgressBar/ProgressBar';
import ActionsBtn from '@/components/words/ActionsBtn/ActionsBtn';

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
  const columns = [
    columnHelper.accessor('en', {
      header: 'Word',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('ua', {
      header: 'Translation',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: (info) => <ProgressBar value={info.getValue()} />,
    }),

    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) =>
        variant === 'dictionary' ? (
          <ActionsBtn
            word={info.row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : null,
    }),
  ];

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
                  <th key={header.id} className={css.th}>
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
                  <td key={cell.id} className={css.td}>
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
