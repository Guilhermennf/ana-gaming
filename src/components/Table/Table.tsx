'use client';

import React, { ReactNode } from 'react';

export interface TableColumn<T> {
  header: string | ReactNode;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  headerClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  emptyState?: ReactNode;
  isLoading?: boolean;
  loadingComponent?: ReactNode;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  className = '',
  headerClassName = '',
  rowClassName = () => '',
  emptyState,
  isLoading = false,
  loadingComponent,
}: TableProps<T>) {
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    );
  }

  if (data.length === 0) {
    return (
      emptyState || (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
          Não há dados disponíveis no momento.
        </div>
      )
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full bg-white ${className}`}>
        <thead>
          <tr className={headerClassName}>
            {columns.map((column, index) => (
              <th
                key={`header-${index}`}
                className={`py-2 px-4 border-b ${
                  index === 0 ? 'text-left' : 'text-center'
                } text-gray-500 ${column.headerClassName || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={keyExtractor(item)}
              className={rowClassName(item, rowIndex)}
            >
              {columns.map((column, colIndex) => {
                const value =
                  typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor as keyof T];

                return (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`py-2 px-4 border-b text-gray-500 ${
                      column.cellClassName || ''
                    }`}
                  >
                    {value as ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
