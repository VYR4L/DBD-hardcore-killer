import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';

interface StatusChipProps extends Omit<MuiChipProps, 'color'> {
  status?: 'alive' | 'cooldown' | 'deceased' | 'sold' | 'default';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status = 'default', ...props }) => {
  const getColor = (): MuiChipProps['color'] => {
  switch (status) {
  case 'alive':
  return 'success';
  case 'cooldown':
  return 'warning';
  case 'deceased':
  return 'error';
  case 'sold':
  return 'default';
  default:
  return 'default';
  }
  };

  return <MuiChip color={getColor()} {...props} />;
};
