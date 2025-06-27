import styles from './Table.module.css';
import sortUpImg from '@/assets/images/sort-up.png';
import sortDownImg from '@/assets/images/sort-down.png';
import { useState } from 'react';
import clsx from 'clsx';
import { SortDirection } from '@/enums';

export interface Column {
  name: string;
  key: string;
  width?: number;
  sortable?: boolean;
  renderCell?: (
    value: string | number | boolean | null | undefined,
    row: TableRow,
    rowIndex: number,
    colIndex: number
  ) => React.ReactNode;
}

export type TableCellValue = string | number | boolean | null | undefined;

export type TableRow = Record<string, TableCellValue>;

const compareTableValues = (
  a: TableCellValue,
  b: TableCellValue,
  direction: SortDirection
) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'boolean') a = Number(a);
  if (typeof b === 'boolean') b = Number(b);

  if (typeof a === 'string' && typeof b === 'string') {
    const compareResult = a.localeCompare(b, undefined, {
      sensitivity: 'base',
    });
    return direction === SortDirection.ASC ? compareResult : -compareResult;
  }

  if (a > b) return direction === SortDirection.ASC ? 1 : -1;
  if (a < b) return direction === SortDirection.ASC ? -1 : 1;
  return 0;
};

export const Table = ({
  columns = [],
  rows = [],
}: {
  columns: Column[];
  rows: TableRow[];
}) => {
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);

  const sortedRows = [...rows].sort((a: TableRow, b: TableRow) =>
    compareTableValues(a[sortBy], b[sortBy], sortDirection)
  );

  const handleTableSort = (column: Column) => {
    if (!column.sortable) return;

    if (column.key === sortBy) {
      setSortDirection(
        sortDirection === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC
      );
      return;
    }

    setSortBy(column.key);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              className={clsx(styles.th, column.sortable && styles.sortable)}
              key={index}
              onClick={() => handleTableSort(column)}
            >
              {column.name}

              {column.sortable && column.key === sortBy && (
                <img
                  className={styles.sortImg}
                  src={
                    sortDirection === SortDirection.ASC
                      ? sortUpImg
                      : sortDownImg
                  }
                  alt="Sort"
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, index) => (
          <tr key={index}>
            {columns.map((column, colIndex) => (
              <td
                className={styles.td}
                style={{ width: column.width }}
                key={colIndex}
              >
                {column.renderCell
                  ? column.renderCell(row?.[column.key], row, index, colIndex)
                  : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
