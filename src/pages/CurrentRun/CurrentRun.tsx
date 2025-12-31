import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useRun } from '@/context/RunContext';
import { CurrencyChip } from '@components/atoms/CurrencyChip';
import { RankChip } from '@components/atoms/RankChip';
import { PipDisplay } from '@components/atoms/PipDisplay';
import { KillerStatusDisplay } from './components/KillerStatusDisplay';
import { MatchHistoryTable } from './components/MatchHistoryTable';
import { RunSummary } from './components/RunSummary';
import { MatchEntryForm } from './components/MatchEntryForm';

const CurrentRun: React.FC = () => {
  const { runData } = useRun();

  // Determine max pips based on current rank
  const getMaxPips = (rank: string): number => {
    if (rank.includes('Ash IV') || rank.includes('Ash III')) return 3;
    if (rank.includes('Ash II') || rank.includes('Ash I') || rank.includes('Bronze I')) return 4;
    return 5; // Silver, Gold, Iridescent
  };

  const maxPips = getMaxPips(runData.currentRank);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box display="flex" gap={3} alignItems="center">
          <Card sx={{ px: 3, py: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <RankChip rank={runData.currentRank} size="large" showLabel={false} />
              <Typography variant="body2" fontWeight={600} color="primary" textAlign="center">
                {runData.currentRank}
              </Typography>
              <PipDisplay 
                currentPips={runData.accumulatedPips} 
                maxPips={maxPips}
                size="medium"
              />
              <Typography variant="caption" color="text.secondary">
                {runData.accumulatedPips}/{maxPips} pips
              </Typography>
            </Box>
          </Card>
          <Typography variant="h3" fontWeight={700} color="primary">
            Current Run
          </Typography>
        </Box>
        <CurrencyChip 
            amount={runData.currentFund} 
            label="Current Funds"
            showColor={false}
          />
      </Box>

      <Grid container spacing={3}>
        {/* Killer Status Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Killer Status
              </Typography>
              <KillerStatusDisplay />
            </CardContent>
          </Card>
        </Grid>

        {/* Match Entry Form */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                Add New Match
              </Typography>
              <MatchEntryForm />
            </CardContent>
          </Card>
        </Grid>

        {/* Match History Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                Match History
              </Typography>
              <MatchHistoryTable />
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <RunSummary />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CurrentRun;
