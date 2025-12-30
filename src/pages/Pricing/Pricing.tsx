import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataService } from '@/services/DataService';
import { KillerTier } from '@/types';

const Pricing: React.FC = () => {
  // Load actual data from DataService
  const killers = DataService.getKillers();
  const perks = DataService.getPerks();
  
  const [killerSearch, setKillerSearch] = useState('');
  const [perkSearch, setPerkSearch] = useState('');

  // Filter killers by search term
  const filteredKillers = killers.filter(k => 
    k.name.toLowerCase().includes(killerSearch.toLowerCase())
  );

  const killerPricing = {
    bottomTier: filteredKillers.filter(k => k.tier === KillerTier.BOTTOM),
    lowTier: filteredKillers.filter(k => k.tier === KillerTier.LOW),
    midTier: filteredKillers.filter(k => k.tier === KillerTier.MID),
    topTier: filteredKillers.filter(k => k.tier === KillerTier.TOP),
  };

  const rewardsAndPenalties = [
    { event: 'Per Kill', amount: '+$5', color: 'success' },
    { event: '4 Gens Left Bonus', amount: '+$2', color: 'success' },
    { event: '5 Gens Left Bonus', amount: '+$4', color: 'success' },
    { event: 'Gen Before Hook', amount: '-$3', color: 'error' },
    { event: 'Last Gen Popped', amount: '-$5', color: 'error' },
    { event: 'Door Opened', amount: '-$5', color: 'error' },
    { event: 'Hatch Escape', amount: '-$5', color: 'error' },
  ];

  // Sort and filter perks by price (descending) then by name
  const sortedPerks = [...perks]
    .filter(p => p.name.toLowerCase().includes(perkSearch.toLowerCase()))
    .sort((a, b) => {
      if (b.price !== a.price) return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const renderKillerTable = (tierName: string, tierKillers: typeof killers) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
    <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
      {tierName}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
      {tierKillers.length} killer{tierKillers.length !== 1 ? 's' : ''}
    </Typography>
    <TableContainer sx={{ maxHeight: 400 }}>
      <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
        <TableCell>Killer</TableCell>
        <TableCell align="right">Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tierKillers.map((killer) => (
        <TableRow key={killer.id}>
          <TableCell>{killer.name}</TableCell>
          <TableCell align="right">
          <Chip 
            label={`$${killer.price}`} 
            size="small" 
            color={killer.price === 0 ? 'success' : 'default'}
          />
          </TableCell>
        </TableRow>
        ))}
      </TableBody>
      </Table>
    </TableContainer>
    </CardContent>
  </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
        Pricing Guide
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        All costs, rewards, and penalties for Season 4
      </Typography>

      {/* Killer Pricing */}
      <Box sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Killer Rental Costs
          </Typography>
          <TextField
            size="small"
            placeholder="Search killers..."
            value={killerSearch}
            onChange={(e) => setKillerSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            {renderKillerTable('Bottom Tier', killerPricing.bottomTier)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderKillerTable('Low Tier', killerPricing.lowTier)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderKillerTable('Mid Tier', killerPricing.midTier)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderKillerTable('Top Tier', killerPricing.topTier)}
          </Grid>
        </Grid>
      </Box>

      {/* Rewards & Penalties */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Rewards & Penalties
        </Typography>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardsAndPenalties.map((item) => (
                    <TableRow key={item.event}>
                      <TableCell>{item.event}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={item.amount} 
                          color={item.color as any}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Perk Pricing */}
      <Box sx={{ mt: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" fontWeight={600}>
            Perk Rental Costs
          </Typography>
          <TextField
            size="small"
            placeholder="Search perks..."
            value={perkSearch}
            onChange={(e) => setPerkSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {sortedPerks.length} of {perks.length} perks {perkSearch && `matching "${perkSearch}"`}
        </Typography>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Perk Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPerks.map((perk) => (
                    <TableRow key={perk.id}>
                      <TableCell>{perk.name}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`$${perk.price}`} 
                          size="small"
                          color={perk.price === 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Pricing;
