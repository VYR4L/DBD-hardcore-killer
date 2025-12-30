import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: mode === 'dark' ? darkPalette : lightPalette,
  typography: {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: '-0.01562em',
  },
  h2: {
  fontSize: '2rem',
  fontWeight: 600,
  letterSpacing: '-0.00833em',
  },
  h3: {
  fontSize: '1.75rem',
  fontWeight: 600,
  letterSpacing: '0em',
  },
  h4: {
  fontSize: '1.5rem',
  fontWeight: 600,
  letterSpacing: '0.00735em',
  },
  h5: {
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '0em',
  },
  h6: {
  fontSize: '1.125rem',
  fontWeight: 600,
  letterSpacing: '0.0075em',
  },
  subtitle1: {
  fontSize: '1rem',
  fontWeight: 500,
  letterSpacing: '0.00938em',
  },
  subtitle2: {
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.00714em',
  },
  body1: {
  fontSize: '1rem',
  letterSpacing: '0.00938em',
  },
  body2: {
  fontSize: '0.875rem',
  letterSpacing: '0.01071em',
  },
  button: {
  textTransform: 'none',
  fontWeight: 600,
  },
  },
  shape: {
  borderRadius: 8,
  },
  components: {
  MuiButton: {
  styleOverrides: {
  root: {
    borderRadius: 8,
    padding: '8px 16px',
    boxShadow: 'none',
    '&:hover': {
    boxShadow: '0px 2px 8px rgba(166, 0, 206, 0.3)',
    },
  },
  contained: {
    '&:hover': {
    boxShadow: '0px 4px 12px rgba(166, 0, 206, 0.4)',
    },
  },
  },
  },
  MuiCard: {
  styleOverrides: {
  root: {
    borderRadius: 12,
    boxShadow: mode === 'dark' 
    ? '0px 4px 16px rgba(0, 0, 0, 0.5)' 
    : '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  },
  },
  MuiChip: {
  styleOverrides: {
  root: {
    fontWeight: 600,
    borderRadius: 6,
  },
  },
  },
  MuiTableHead: {
  styleOverrides: {
  root: {
    '& .MuiTableCell-root': {
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.875rem',
    },
  },
  },
  },
  MuiTableCell: {
  styleOverrides: {
  root: {
    borderBottom: `1px solid ${mode === 'dark' ? 'rgba(166, 0, 206, 0.2)' : 'rgba(138, 0, 171, 0.12)'}`,
  },
  },
  },
  MuiAppBar: {
  styleOverrides: {
  root: {
    boxShadow: mode === 'dark' 
    ? '0px 2px 8px rgba(166, 0, 206, 0.3)' 
    : '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  },
  },
  MuiPaper: {
  styleOverrides: {
  root: {
    backgroundImage: 'none',
  },
  },
  },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getThemeOptions(mode));
};
