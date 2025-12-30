import React from 'react';
import { Chip } from '@mui/material';
import { useCurrency } from '@hooks/useCurrency';

interface CurrencyChipProps {
  amount: number;
  label?: string;
  size?: 'small' | 'medium';
  showColor?: boolean;
}

export const CurrencyChip: React.FC<CurrencyChipProps> = ({ 
  amount, 
  label,
  size = 'medium',
  showColor = true 
}) => {
  const { formatCurrency } = useCurrency();

  const getColor = () => {
  if (!showColor) return 'default';
  if (amount > 0) return 'success';
  if (amount < 0) return 'error';
  return 'default';
  };

  return (
  <Chip 
  label={label ? `${label}: ${formatCurrency(amount)}` : formatCurrency(amount)}
  color={getColor() as any}
  size={size}
  sx={{ fontWeight: 600 }}
  />
  );
};
