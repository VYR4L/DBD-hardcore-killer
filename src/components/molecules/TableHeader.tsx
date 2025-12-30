import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

interface TableHeaderProps {
  columns: Column[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
  <TableHead>
  <TableRow>
  {columns.map((column) => (
    <TableCell
    key={column.id}
    align={column.align || 'left'}
    sx={{ width: column.width }}
    >
    {column.label}
    </TableCell>
  ))}
  </TableRow>
  </TableHead>
  );
};
