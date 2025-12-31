import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { useRun } from '@/context/RunContext';
import { DataService } from '@/services/DataService';
import { useCurrency } from '@/hooks/useCurrency';
import { PerkChip } from '@components/atoms/PerkChip';
import { KillerChip } from '@components/atoms/KillerChip';

export const MatchHistoryTable: React.FC = () => {
  const { runData } = useRun();
  const { formatCurrency } = useCurrency();

  if (runData.matches.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          No matches recorded yet. Add your first match above!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Match #</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Killer</TableCell>
            <TableCell>Perks</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Penalties</TableCell>
            <TableCell align="center">Kills</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Bonus</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="center">Pips</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runData.matches.map((match) => {
            const killer = DataService.getKillerById(match.killerId);
            const perkIds = Object.values(match.perks).filter(Boolean) as string[];

            return (
              <TableRow key={match.matchNumber}>
                <TableCell>{match.matchNumber}</TableCell>
                <TableCell>
                  <Chip label={match.rank} size="small" />
                </TableCell>
                <TableCell>
                  {killer ? (
                    <KillerChip killerId={killer.id} size="small" showName={false} />
                  ) : (
                    <Typography variant="caption" color="text.secondary">Unknown</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {perkIds.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">None</Typography>
                    ) : (
                      perkIds.map((perkId) => (
                        <PerkChip key={perkId} perkId={perkId} size="small" showName={false} />
                      ))
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip label={formatCurrency(match.matchCost)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={formatCurrency(match.totalPenalties)} 
                    color={match.totalPenalties < 0 ? 'error' : 'default'}
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip label={match.kills} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={match.killerDied ? 'Died' : 'Alive'} 
                    color={match.killerDied ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {match.bonus ? (
                    <Chip 
                      label={match.bonus.type} 
                      color="success" 
                      size="small"
                    />
                  ) : '-'}
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={formatCurrency(match.newBalance)} 
                    color={match.newBalance < 0 ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip label={`+${match.pips}`} size="small" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
