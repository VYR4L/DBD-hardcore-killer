import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@context/ThemeContext';
import { RunProvider } from '@context/RunContext';
import { Navbar } from '@components/organisms/Navbar';
import { GlobalFooter } from '@components/organisms/GlobalFooter';

// Pages
import Rules from '@pages/Rules/Rules';
import Pricing from '@pages/Pricing/Pricing';
import CurrentRun from '@pages/CurrentRun/CurrentRun';
import Market from '@pages/Market/Market';
import RankStatus from '@pages/RankStatus/RankStatus';

const App: React.FC = () => {
  return (
  <ThemeProvider>
  <RunProvider>
  <Router>
    <Box
    sx={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    }}
    >
    <Navbar />
    <Box component="main" sx={{ flexGrow: 1 }}>
    <Routes>
    <Route path="/" element={<Rules />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/current-run" element={<CurrentRun />} />
    <Route path="/market" element={<Market />} />
    <Route path="/rank-status" element={<RankStatus />} />
    </Routes>
    </Box>
    <GlobalFooter />
    </Box>
  </Router>
  </RunProvider>
  </ThemeProvider>
  );
};

export default App;
