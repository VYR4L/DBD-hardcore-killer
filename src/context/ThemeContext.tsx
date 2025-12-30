import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '@theme/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
  const savedMode = localStorage.getItem('themeMode');
  return (savedMode as ThemeMode) || 'dark';
  });

  const toggleTheme = () => {
  setMode((prevMode) => {
  const newMode = prevMode === 'light' ? 'dark' : 'light';
  localStorage.setItem('themeMode', newMode);
  return newMode;
  });
  };

  useEffect(() => {
  localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = createAppTheme(mode);

  return (
  <ThemeContext.Provider value={{ mode, toggleTheme }}>
  <MuiThemeProvider theme={theme}>
  <CssBaseline />
  {children}
  </MuiThemeProvider>
  </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
  throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
