import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'primary' 
}) => {
  return (
  <Card 
  sx={{ 
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 4,
  }
  }}
  >
  <CardContent>
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
    {title}
    </Typography>
    {icon && (
    <Box color={`${color}.main`}>
    {icon}
    </Box>
    )}
  </Box>
  <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
    {value}
  </Typography>
  {subtitle && (
    <Typography variant="body2" color="text.secondary" mt={0.5}>
    {subtitle}
    </Typography>
  )}
  </CardContent>
  </Card>
  );
};
