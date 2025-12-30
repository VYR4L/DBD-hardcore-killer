import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@context/ThemeContext';

export const ThemeSwitch: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
  <FormControlLabel
  control={
  <Switch
    checked={mode === 'dark'}
    onChange={toggleTheme}
    icon={<Brightness7 />}
    checkedIcon={<Brightness4 />}
  />
  }
  label=""
  />
  );
};
