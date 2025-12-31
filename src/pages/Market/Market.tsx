import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { DataService } from '@/services/DataService';
import { KillerTier } from '@/types';
import { useRun } from '@/context/RunContext';
import { SellKillersForm } from './components/SellKillersForm';

const Market: React.FC = () => {
  // Load actual data from DataService
  const killers = DataService.getKillers();
  const { runData } = useRun();

  const killersByTier = {
  [KillerTier.BOTTOM]: killers.filter(k => k.tier === KillerTier.BOTTOM),
  [KillerTier.LOW]: killers.filter(k => k.tier === KillerTier.LOW),
  [KillerTier.MID]: killers.filter(k => k.tier === KillerTier.MID),
  [KillerTier.TOP]: killers.filter(k => k.tier === KillerTier.TOP),
  };

  const tierPrices = {
  [KillerTier.BOTTOM]: 0,
  [KillerTier.LOW]: 0,
  [KillerTier.MID]: 10,
  [KillerTier.TOP]: 20,
  };

  return (
  <Container maxWidth="xl" sx={{ py: 4 }}>
  <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
  Killer Market
  </Typography>
  <Typography variant="body1" color="text.secondary" paragraph>
  Sell your alive killers for their face value to regain funds
  </Typography>

  {/* Sales History */}
  <Box sx={{ mt: 4 }}>
  <Typography variant="h5" gutterBottom fontWeight={600}>
    Sales History
  </Typography>
  <Card sx={{ mt: 2 }}>
    <CardContent>
    <TableContainer>
    <Table>
    <TableHead>
      <TableRow>
      <TableCell>Match #</TableCell>
      <TableCell>Killer(s) Sold</TableCell>
      <TableCell align="right">$ Gained</TableCell>
      <TableCell align="right">New Balance</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {runData.sales.length === 0 ? (
        <TableRow>
        <TableCell colSpan={4} align="center">
        <Typography variant="body2" color="text.secondary">
        No sales recorded yet
        </Typography>
        </TableCell>
        </TableRow>
      ) : (
        runData.sales.map((sale, index) => {
          const killerNames = sale.killersSold
            .map((id: string) => killers.find(k => k.id === id)?.name)
            .filter(Boolean)
            .join(', ');
          return (
            <TableRow key={index}>
            <TableCell>{sale.nextMatchNumber}</TableCell>
            <TableCell>{killerNames}</TableCell>
            <TableCell align="right">
              <Chip label={`$${sale.moneyGained}`} color="success" size="small" />
            </TableCell>
            <TableCell align="right">
              <Chip label={`$${sale.newCurrentFunds}`} size="small" />
            </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
    </Table>
    </TableContainer>
    </CardContent>
  </Card>
  </Box>

  {/* Killer Values Reference */}
  <Box sx={{ mt: 6 }}>
    <Typography variant="h5" gutterBottom fontWeight={600}>
    Killer Values by Tier
    </Typography>
    <Grid container spacing={3} sx={{ mt: 1 }}>
    {Object.entries(tierPrices).map(([tier, price]) => {
      const tierKillers = killersByTier[tier as KillerTier];
      return (
      <Grid item xs={12} sm={6} md={3} key={tier}>
        <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          {tier}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Sale Value:
          </Typography>
          <Chip 
            label={`$${price}`} 
            color={price === 0 ? 'success' : 'primary'}
            size="small"
          />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          {tierKillers.length} killer{tierKillers.length !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          <Typography variant="caption" color="text.secondary" component="div">
            {tierKillers.map(k => k.name).join(', ')}
          </Typography>
          </Box>
        </CardContent>
        </Card>
      </Grid>
      );
    })}
    </Grid>
  </Box>

  {/* Sell Interface */}
  <Box sx={{ mt: 6 }}>
  <Typography variant="h5" gutterBottom fontWeight={600}>
    Sell Killers
  </Typography>
  <Card sx={{ mt: 2 }}>
    <CardContent>
    <SellKillersForm />
    </CardContent>
  </Card>
  </Box>
  </Container>
  );
};

export default Market;
