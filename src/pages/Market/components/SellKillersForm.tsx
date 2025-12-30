import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Sell } from '@mui/icons-material';
import { DataService } from '@/services/DataService';
import { useRun } from '@/context/RunContext';
import { useCurrency } from '@/hooks/useCurrency';
import { KillerTier, Rank } from '@/types';

export const SellKillersForm: React.FC = () => {
  const { runData, addSale } = useRun();
  const { formatCurrency } = useCurrency();
  const allKillers = DataService.getKillers();
  const [selectedKillers, setSelectedKillers] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Get available killers for sale (alive only)
  const availableKillers = useMemo(() => {
    return allKillers.filter(killer => {
      const isAlive = !runData.deadKillers.includes(killer.id);
      const notSold = !runData.soldKillers.includes(killer.id);
      return isAlive && notSold;
    });
  }, [allKillers, runData]);

  // Group available killers by tier
  const killersByTier = useMemo(() => {
    return {
      [KillerTier.BOTTOM]: availableKillers.filter(k => k.tier === KillerTier.BOTTOM),
      [KillerTier.LOW]: availableKillers.filter(k => k.tier === KillerTier.LOW),
      [KillerTier.MID]: availableKillers.filter(k => k.tier === KillerTier.MID),
      [KillerTier.TOP]: availableKillers.filter(k => k.tier === KillerTier.TOP),
    };
  }, [availableKillers]);

  // Calculate total sale value
  const totalSaleValue = useMemo(() => {
    return selectedKillers.reduce((sum, killerId) => {
      const killer = allKillers.find(k => k.id === killerId);
      return sum + (killer?.price || 0);
    }, 0);
  }, [selectedKillers, allKillers]);

  const handleToggleKiller = (killerId: string) => {
    setSelectedKillers(prev => 
      prev.includes(killerId) 
        ? prev.filter(id => id !== killerId)
        : [...prev, killerId]
    );
  };

  const handleSelectAll = (tier: KillerTier) => {
    const tierKillers = killersByTier[tier].map(k => k.id);
    const allSelected = tierKillers.every(id => selectedKillers.includes(id));
    
    if (allSelected) {
      setSelectedKillers(prev => prev.filter(id => !tierKillers.includes(id)));
    } else {
      setSelectedKillers(prev => [...new Set([...prev, ...tierKillers])]);
    }
  };

  const handleSell = () => {
    if (selectedKillers.length === 0) {
      alert('Please select at least one killer to sell');
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmSale = () => {
    const nextMatchNumber = runData.matches.length + 1;

    // Process sale
    addSale({
      grade: runData.matches.length > 0 ? runData.matches[runData.matches.length - 1].rank : Rank.ASH_IV,
      nextMatchNumber,
      killersSold: selectedKillers,
      moneyGained: totalSaleValue,
      newCurrentFunds: runData.currentFund + totalSaleValue,
    });

    // Reset selection and close dialog
    setSelectedKillers([]);
    setConfirmDialogOpen(false);
  };

  const renderTierSection = (tier: KillerTier, tierKillers: typeof allKillers) => {
    if (tierKillers.length === 0) return null;

    const allSelected = tierKillers.every(k => selectedKillers.includes(k.id));
    const someSelected = tierKillers.some(k => selectedKillers.includes(k.id));

    return (
      <Grid item xs={12} key={tier}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight={600}>
                  {tier}
                </Typography>
                <Chip 
                  label={`${tierKillers.length} available`} 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label={`$${tierKillers[0]?.price || 0} each`} 
                  size="small"
                />
              </Box>
              <Button
                size="small"
                onClick={() => handleSelectAll(tier)}
                variant={allSelected ? 'outlined' : 'text'}
              >
                {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
              </Button>
            </Box>
            <Grid container spacing={1}>
              {tierKillers.map(killer => (
                <Grid item xs={12} sm={6} md={4} key={killer.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedKillers.includes(killer.id)}
                        onChange={() => handleToggleKiller(killer.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{killer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${killer.price}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      {availableKillers.length === 0 ? (
        <Alert severity="info">
          No killers available for sale. All killers are either deceased or already sold.
        </Alert>
      ) : (
        <>
          <Grid container spacing={2}>
            {Object.entries(killersByTier).map(([tier, killers]) => 
              renderTierSection(tier as KillerTier, killers)
            )}
          </Grid>

          {/* Sale Summary */}
          {selectedKillers.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Killers Selected
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedKillers.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Total Sale Value
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.main">
                      {formatCurrency(totalSaleValue)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      New Balance
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(runData.currentFund + totalSaleValue)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}

          {/* Sell Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Sell />}
              onClick={handleSell}
              disabled={selectedKillers.length === 0}
              color="success"
            >
              Sell {selectedKillers.length > 0 ? `${selectedKillers.length} Killer${selectedKillers.length > 1 ? 's' : ''}` : 'Selected Killers'} for {formatCurrency(totalSaleValue)}
            </Button>
          </Box>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Killer Sale</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to sell {selectedKillers.length} killer{selectedKillers.length > 1 ? 's' : ''} for {formatCurrency(totalSaleValue)}?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Killers to be sold:
            </Typography>
            {selectedKillers.map(id => {
              const killer = allKillers.find(k => k.id === id);
              return (
                <Chip 
                  key={id}
                  label={`${killer?.name} ($${killer?.price})`}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              );
            })}
          </Box>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}>
            <Typography variant="h6">
              New Balance: {formatCurrency(runData.currentFund + totalSaleValue)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmSale} variant="contained" color="success">
            Confirm Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
