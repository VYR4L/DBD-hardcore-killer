import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { DataService } from '@/services/DataService';
import perkBackground from '@/assets/images/perk-background.png';

interface PerkChipProps {
  perkId: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

export const PerkChip: React.FC<PerkChipProps> = ({ 
  perkId, 
  size = 'medium',
  showName = true 
}) => {
  const perk = DataService.getPerkById(perkId);

  if (!perk) {
    return null;
  }

  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const iconSize = sizeMap[size];

  return (
    <Tooltip title={perk.name} arrow>
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
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s, filter 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              filter: 'brightness(1.2)',
            },
          }}
        >
          {/* Background diamond */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${perkBackground})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
            }}
          />
          {/* Perk icon */}
          <img
            src={perk.image}
            alt={perk.name}
            style={{
              width: '70%',
              height: '70%',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </Box>
        {showName && size !== 'small' && (
          <Typography
            variant={size === 'large' ? 'body1' : 'caption'}
            sx={{
              fontWeight: 500,
              color: 'text.primary',
            }}
          >
            {perk.name}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};
