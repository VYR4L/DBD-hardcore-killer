/**
 * Custom hook for currency formatting and calculations
 */
export const useCurrency = () => {
  /**
   * Format a number as currency
   */
  const formatCurrency = (amount: number): string => {
  const sign = amount < 0 ? '-' : '';
  const absAmount = Math.abs(amount);
  return `${sign}$${absAmount}`;
  };

  /**
   * Format with color indicator for positive/negative
   */
  const formatCurrencyWithColor = (amount: number): { 
  formatted: string; 
  color: 'success' | 'error' | 'default' 
  } => {
  const formatted = formatCurrency(amount);
  let color: 'success' | 'error' | 'default' = 'default';
  
  if (amount > 0) {
  color = 'success';
  } else if (amount < 0) {
  color = 'error';
  }
  
  return { formatted, color };
  };

  /**
   * Calculate profit/loss
   */
  const calculateProfitLoss = (starting: number, ending: number): number => {
  return ending - starting;
  };

  /**
   * Calculate percentage change
   */
  const calculatePercentageChange = (starting: number, ending: number): number => {
  if (starting === 0) return 0;
  return ((ending - starting) / starting) * 100;
  };

  /**
   * Format percentage
   */
  const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
  };

  /**
   * Check if amount would result in bankruptcy
   */
  const willGoBankrupt = (currentFunds: number, expense: number): boolean => {
  return (currentFunds - expense) < 0;
  };

  /**
   * Calculate total from array of numbers
   */
  const calculateTotal = (amounts: number[]): number => {
  return amounts.reduce((sum, amount) => sum + amount, 0);
  };

  return {
  formatCurrency,
  formatCurrencyWithColor,
  calculateProfitLoss,
  calculatePercentageChange,
  formatPercentage,
  willGoBankrupt,
  calculateTotal,
  };
};
