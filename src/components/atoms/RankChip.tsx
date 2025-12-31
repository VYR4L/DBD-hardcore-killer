import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

interface RankChipProps {
  rank: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const RankChip: React.FC<RankChipProps> = ({ 
  rank, 
  size = 'medium',
  showLabel = false,
}) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const iconSize = sizeMap[size];

  const getRankImage = (rankName: string): string => {
    const baseUrl = 'https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images';
    
    if (rankName === 'Iridescent I') {
      return `${baseUrl}/4/4c/IconGrade_killerIridescent_I.png`;
    }
    
    if (rankName.includes('Ash')) {
      return `${baseUrl}/3/35/IconGrade_killerAsh.png`;
    }
    if (rankName.includes('Bronze')) {
      return `${baseUrl}/f/ff/IconGrade_killerBronze.png`;
    }
    if (rankName.includes('Silver')) {
      return `${baseUrl}/a/a3/IconGrade_killerSilver.png`;
    }
    if (rankName.includes('Gold')) {
      return `${baseUrl}/d/db/IconGrade_killerGold.png`;
    }
    if (rankName.includes('Iridescent')) {
      return `${baseUrl}/3/36/IconGrade_killerIridescent.png`;
    }
    
    return `${baseUrl}/3/35/IconGrade_killerAsh.png`;
  };

  return (
    <Tooltip title={rank} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          flexDirection: showLabel ? 'row' : 'column',
        }}
      >
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <img
            src={getRankImage(rank)}
            alt={rank}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            }}
          />
        </Box>
        {showLabel && (
          <Typography
            variant={size === 'large' ? 'body1' : 'caption'}
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {rank}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};
