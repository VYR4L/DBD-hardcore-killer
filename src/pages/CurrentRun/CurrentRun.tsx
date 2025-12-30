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
import { KillerStatusDisplay } from './components/KillerStatusDisplay';
import { MatchHistoryTable } from './components/MatchHistoryTable';
import { RunSummary } from './components/RunSummary';
import { MatchEntryForm } from './components/MatchEntryForm';

const CurrentRun: React.FC = () => {
  const { runData } = useRun();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" fontWeight={700} color="primary">
          Current Run
        </Typography>
        <Box display="flex" gap={2}>
          <Card sx={{ px: 3, py: 1.5, minWidth: 180 }}>
            <Typography variant="caption" color="text.secondary">
              Current Rank - {runData.accumulatedPips} pip{runData.accumulatedPips !== 1 ? 's' : ''} accumulated
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary">
              {runData.currentRank}
            </Typography>
          </Card>
          <CurrencyChip 
            amount={runData.currentFund} 
            label="Current Funds"
            showColor={false}
          />
        </Box>
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
