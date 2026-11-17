import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="relative w-full overflow-auto rounded-md border border-gray-200">
    <table className={clsx('w-full caption-bottom text-sm', className)}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-100">{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className,
  onClick,
}) => (
  <tr
    onClick={onClick}
    className={clsx(
      'transition-colors hover:bg-gray-50',
      onClick && 'cursor-pointer',
      className,
    )}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <th
    className={clsx(
      'h-10 px-4 text-left align-middle font-medium text-gray-500 text-xs uppercase tracking-wider',
      className,
    )}
  >
    {children}
  </th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <td className={clsx('p-4 align-middle text-gray-900', className)}>{children}</td>
);
// add: striped row variant
// fix: table overflow on mobile
