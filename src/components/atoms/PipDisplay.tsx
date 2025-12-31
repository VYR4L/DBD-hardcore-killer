import React from 'react';
import { Box } from '@mui/material';

interface PipDisplayProps {
  currentPips: number;
  maxPips: number;
  size?: 'small' | 'medium' | 'large';
}

export const PipDisplay: React.FC<PipDisplayProps> = ({ 
  currentPips, 
  maxPips,
  size = 'medium',
}) => {
  const sizeMap = {
    small: 12,
    medium: 16,
    large: 20,
  };

  const pipSize = sizeMap[size];
  const circleSize = pipSize + 8;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: maxPips }).map((_, index) => {
        const isFilled = index < currentPips;
        
        return (
          <Box
            key={index}
            sx={{
              width: circleSize,
              height: circleSize,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box
              sx={{
                width: pipSize,
                height: pipSize,
                backgroundColor: isFilled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                transform: 'rotate(45deg)',
                transition: 'background-color 0.3s',
                boxShadow: isFilled ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};
