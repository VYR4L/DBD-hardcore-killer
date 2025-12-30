import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSwitch } from '@components/atoms/ThemeSwitch';
import { CurrencyChip } from '@components/atoms/CurrencyChip';
import { useRun } from '@context/RunContext';

const navItems = [
  { label: 'Rules', path: '/' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Current Run', path: '/current-run' },
  { label: 'Market', path: '/market' },
  { label: 'Rank Status', path: '/rank-status' },
];

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { runData } = useRun();

  const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
  };

  const drawer = (
  <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
  <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 700 }}>
  Hardcore Killer
  </Typography>
  <List>
  {navItems.map((item) => (
    <ListItem key={item.path} disablePadding>
    <ListItemButton
    component={Link}
    to={item.path}
    selected={location.pathname === item.path}
    sx={{
    '&.Mui-selected': {
      backgroundColor: 'primary.dark',
      '&:hover': {
      backgroundColor: 'primary.dark',
      },
    },
    }}
    >
    <ListItemText primary={item.label} />
    </ListItemButton>
    </ListItem>
  ))}
  </List>
  </Box>
  );

  return (
  <>
  <AppBar position="sticky" elevation={0}>
  <Toolbar>
    {isMobile && (
    <IconButton
    color="inherit"
    aria-label="open drawer"
    edge="start"
    onClick={handleDrawerToggle}
    sx={{ mr: 2 }}
    >
    <MenuIcon />
    </IconButton>
    )}
    
    <Typography
    variant="h6"
    component={Link}
    to="/"
    sx={{
    flexGrow: isMobile ? 1 : 0,
    mr: 4,
    fontWeight: 700,
    textDecoration: 'none',
    color: 'inherit',
    }}
    >
    Hardcore Killer - Season 4
    </Typography>

    {!isMobile && (
    <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
    {navItems.map((item) => (
    <Typography
      key={item.path}
      component={Link}
      to={item.path}
      sx={{
      color: location.pathname === item.path ? 'primary.light' : 'inherit',
      textDecoration: 'none',
      fontWeight: location.pathname === item.path ? 700 : 500,
      '&:hover': {
      color: 'primary.light',
      },
      }}
    >
      {item.label}
    </Typography>
    ))}
    </Box>
    )}

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {!isMobile && (
    <CurrencyChip 
    amount={runData.currentFund} 
    label="Current Funds"
    showColor={false}
    />
    )}
    <ThemeSwitch />
    </Box>
  </Toolbar>
  </AppBar>

  <Drawer
  variant="temporary"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{
    keepMounted: true,
  }}
  sx={{
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
  }}
  >
  {drawer}
  </Drawer>
  </>
  );
};
