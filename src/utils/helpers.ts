export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

export const parseNumber = (value: string): number => {
  return parseInt(value.replace(/,/g, ''), 10) || 0;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getRankFromPips = (totalPips: number): string => {
  // Simple rank calculation - can be expanded based on actual rank system
  if (totalPips >= 80) return 'Iridescent I';
  if (totalPips >= 60) return 'Gold I';
  if (totalPips >= 40) return 'Silver I';
  if (totalPips >= 20) return 'Bronze I';
  return 'Ash IV';
};
