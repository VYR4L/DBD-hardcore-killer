import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { DataService } from '@/services/DataService';

interface KillerChipProps {
  killerId: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showPrice?: boolean;
}

export const KillerChip: React.FC<KillerChipProps> = ({ 
  killerId, 
  size = 'medium',
  showName = true,
  showPrice = false,
}) => {
  const killer = DataService.getKillerById(killerId);

  if (!killer) {
    return null;
  }

  const sizeMap = {
    small: 40,
    medium: 56,
    large: 72,
  };

  const iconSize = sizeMap[size];

  return (
    <Tooltip title={killer.name} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: 1,
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s, border-color 0.2s',
            backgroundColor: 'background.paper',
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: 'primary.main',
            },
          }}
        >
          <img
            src={killer.image}
            alt={killer.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        {(showName || showPrice) && size !== 'small' && (
          <Box>
            {showName && (
              <Typography
                variant={size === 'large' ? 'body1' : 'caption'}
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {killer.name}
              </Typography>
            )}
            {showPrice && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                }}
              >
                ${killer.price}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};
