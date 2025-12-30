import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { StatCard } from '@components/molecules/StatCard';
import { useRun } from '@/context/RunContext';
import { useCurrency } from '@/hooks/useCurrency';
import {
  AttachMoney,
  Warning,
  Person,
  TrendingDown,
  EmojiEvents,
} from '@mui/icons-material';

export const RunSummary: React.FC = () => {
  const { runData } = useRun();
  const { formatCurrency } = useCurrency();

  const totalSpent = runData.matches.reduce((sum, match) => sum + match.matchCost, 0);
  const totalPenalties = runData.matches.reduce((sum, match) => sum + match.totalPenalties, 0);
  const totalKills = runData.matches.reduce((sum, match) => sum + match.kills, 0);
  const killersLost = runData.deadKillers.length;
  const totalBonus = runData.matches.reduce((sum, match) => sum + (match.bonus?.amount || 0), 0);
  const endBalance = runData.currentFund;
  const totalPips = runData.matches.reduce((sum, match) => sum + match.pips, 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600} mb={3}>
        Run Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            color="error"
            icon={<AttachMoney />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Penalties"
            value={formatCurrency(totalPenalties)}
            color="warning"
            icon={<Warning />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Kills"
            value={totalKills}
            color="primary"
            icon={<Person />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Killers Lost"
            value={killersLost}
            color="error"
            icon={<TrendingDown />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bonus Money"
            value={formatCurrency(totalBonus)}
            color="success"
            icon={<EmojiEvents />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Balance"
            value={formatCurrency(endBalance)}
            color={endBalance < 0 ? 'error' : 'success'}
            icon={<AttachMoney />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pips"
            value={totalPips}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Matches"
            value={runData.matches.length}
            color="secondary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
