import React, { useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { DataService } from '@/services/DataService';
import { useRun } from '@/context/RunContext';
import { StatusChip } from '@components/atoms/StatusChip';

export const KillerStatusDisplay: React.FC = () => {
  const { runData } = useRun();
  const allKillers = DataService.getKillers();

  const killerStatus = useMemo(() => {
    const alive = allKillers.filter(
      k => !runData.deadKillers.includes(k.id) && 
           !runData.soldKillers.includes(k.id) &&
           !runData.cooldownKillers.includes(k.id)
    );
    const cooldown = allKillers.filter(k => runData.cooldownKillers.includes(k.id));
    const deceased = allKillers.filter(k => runData.deadKillers.includes(k.id));
    const sold = allKillers.filter(k => runData.soldKillers.includes(k.id));

    return { alive, cooldown, deceased, sold };
  }, [allKillers, runData]);

  const renderKillerList = (killers: typeof allKillers, status: 'alive' | 'cooldown' | 'deceased' | 'sold') => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {killers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          None
        </Typography>
      ) : (
        killers.map(killer => (
          <StatusChip
            key={killer.id}
            label={`${killer.name} ($${killer.price})`}
            status={status}
            size="small"
          />
        ))
      )}
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Alive Killers
              </Typography>
              <Chip label={killerStatus.alive.length} color="success" size="small" />
            </Box>
            {renderKillerList(killerStatus.alive, 'alive')}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                On Cooldown
              </Typography>
              <Chip label={killerStatus.cooldown.length} color="warning" size="small" />
            </Box>
            {renderKillerList(killerStatus.cooldown, 'cooldown')}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Deceased
              </Typography>
              <Chip label={killerStatus.deceased.length} color="error" size="small" />
            </Box>
            {renderKillerList(killerStatus.deceased, 'deceased')}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Sold
              </Typography>
              <Chip label={killerStatus.sold.length} size="small" />
            </Box>
            {renderKillerList(killerStatus.sold, 'sold')}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
