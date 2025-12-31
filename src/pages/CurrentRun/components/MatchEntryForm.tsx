import React, { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataService } from '@/services/DataService';
import { useRun } from '@/context/RunContext';
import { useMatchLogic } from '@/hooks/useMatchLogic';
import { useCurrency } from '@/hooks/useCurrency';
import { PenaltyType, Match, Penalty, Bonus, BonusType, Rank } from '@/types';
import { PerkChip } from '@components/atoms/PerkChip';

const matchSchema = z.object({
  killerId: z.string().min(1, 'Please select a killer'),
  perk1: z.string().optional(),
  perk2: z.string().optional(),
  perk3: z.string().optional(),
  perk4: z.string().optional(),
  kills: z.number().min(0).max(4),
  pips: z.number().min(0).max(2, 'Maximum 2 pips per match'),
  penalties: z.object({
    genBeforeHook: z.boolean(),
    lastGenPopped: z.boolean(),
    doorOpened: z.boolean(),
    hatchEscape: z.boolean(),
  }),
  bonuses: z.object({
    fourGensLeft: z.boolean(),
    fiveGensLeft: z.boolean(),
  }),
});

type MatchFormData = z.infer<typeof matchSchema>;

export const MatchEntryForm: React.FC = () => {
  const { runData, addMatch } = useRun();
  const { calculateMatchOutcome, validateMatch, checkCooldownStatus } = useMatchLogic();
  const { formatCurrency } = useCurrency();
  const allKillers = DataService.getKillers();
  const allPerks = DataService.getPerks();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      killerId: '',
      perk1: '',
      perk2: '',
      perk3: '',
      perk4: '',
      kills: 0,
      pips: 0,
      penalties: {
        genBeforeHook: false,
        lastGenPopped: false,
        doorOpened: false,
        hatchEscape: false,
      },
      bonuses: {
        fourGensLeft: false,
        fiveGensLeft: false,
      },
    },
  });

  const watchedValues = watch();

  // Get available killers (alive and not on cooldown)
  const availableKillers = useMemo(() => {
    return allKillers.filter(killer => {
      const isAlive = !runData.deadKillers.includes(killer.id);
      const notSold = !runData.soldKillers.includes(killer.id);
      const isOnCooldown = runData.cooldownKillers.includes(killer.id);
      return isAlive && notSold && !isOnCooldown;
    });
  }, [allKillers, runData, checkCooldownStatus]);

  // Calculate preview of match outcome
  const matchPreview = useMemo(() => {
    if (!watchedValues.killerId || watchedValues.killerId === '') return null;

    const penalties: PenaltyType[] = [];
    if (watchedValues.penalties.genBeforeHook) penalties.push(PenaltyType.GEN_BEFORE_HOOK);
    if (watchedValues.penalties.lastGenPopped) penalties.push(PenaltyType.LAST_GEN_POPPED);
    if (watchedValues.penalties.doorOpened) penalties.push(PenaltyType.DOOR_OPENED);
    if (watchedValues.penalties.hatchEscape) penalties.push(PenaltyType.HATCH_ESCAPE);

    try {
      const killer = allKillers.find(k => k.id === watchedValues.killerId);
      if (!killer) return null;

      const perkIds = [
        watchedValues.perk1 || undefined,
        watchedValues.perk2 || undefined,
        watchedValues.perk3 || undefined,
        watchedValues.perk4 || undefined,
      ];

      const matchCost = DataService.calculateLoadoutCost(killer.id, perkIds);

      const penaltyObjs: Penalty[] = penalties.map(p => ({
        type: p,
        amount: p === PenaltyType.GEN_BEFORE_HOOK ? -3 : -5,
        count: 1,
      }));

      const hatchEscape = watchedValues.penalties.hatchEscape;
      const bonus: Bonus | null = watchedValues.bonuses.fiveGensLeft
        ? { type: BonusType.FIVE_GENS_LEFT, amount: 4 }
        : watchedValues.bonuses.fourGensLeft
        ? { type: BonusType.FOUR_GENS_LEFT, amount: 2 }
        : null;

      const calculations = calculateMatchOutcome(
        runData.currentFund,
        matchCost,
        watchedValues.kills,
        penaltyObjs,
        bonus,
        hatchEscape
      );

      return { ...calculations, kills: watchedValues.kills, pips: watchedValues.pips, matchCost };
    } catch (error) {
      return null;
    }
  }, [watchedValues, runData, calculateMatchOutcome]);

  const onSubmit = async (data: MatchFormData) => {
    const killer = allKillers.find(k => k.id === data.killerId);
    if (!killer) {
      setErrorMessage('Invalid killer selected');
      setErrorDialogOpen(true);
      return;
    }

    const perkIds = [
      data.perk1 || undefined,
      data.perk2 || undefined,
      data.perk3 || undefined,
      data.perk4 || undefined,
    ];

    const matchCost = DataService.calculateLoadoutCost(killer.id, perkIds);

    const validation = validateMatch(
      runData.currentFund,
      matchCost,
      killer.id,
      runData.deadKillers,
      runData.cooldownKillers
    );
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Cannot complete match');
      setErrorDialogOpen(true);
      return;
    }

    const penaltyTypes: PenaltyType[] = [];
    if (data.penalties.genBeforeHook) penaltyTypes.push(PenaltyType.GEN_BEFORE_HOOK);
    if (data.penalties.lastGenPopped) penaltyTypes.push(PenaltyType.LAST_GEN_POPPED);
    if (data.penalties.doorOpened) penaltyTypes.push(PenaltyType.DOOR_OPENED);
    if (data.penalties.hatchEscape) penaltyTypes.push(PenaltyType.HATCH_ESCAPE);

    const penaltyObjs: Penalty[] = penaltyTypes.map(p => ({
      type: p,
      amount: p === PenaltyType.GEN_BEFORE_HOOK ? -3 : -5,
      count: 1,
    }));

    const hatchEscape = data.penalties.hatchEscape;
    const bonus: Bonus | null = data.bonuses.fiveGensLeft
      ? { type: BonusType.FIVE_GENS_LEFT, amount: 4 }
      : data.bonuses.fourGensLeft
      ? { type: BonusType.FOUR_GENS_LEFT, amount: 2 }
      : null;

    const calculations = calculateMatchOutcome(
      runData.currentFund,
      matchCost,
      data.kills,
      penaltyObjs,
      bonus,
      hatchEscape
    );

    const match: Match = {
      matchNumber: runData.matches.length + 1,
      matchFunds: runData.currentFund,
      killerId: killer.id,
      killerName: killer.name,
      perks: {
        perk1Id: data.perk1 || undefined,
        perk2Id: data.perk2 || undefined,
        perk3Id: data.perk3 || undefined,
        perk4Id: data.perk4 || undefined,
      },
      matchCost,
      remainingFunds: runData.currentFund - matchCost,
      penalties: penaltyObjs,
      totalPenalties: calculations.totalPenalties,
      kills: data.kills,
      killerDied: calculations.killerDied,
      bonus,
      newBalance: calculations.newBalance,
      pips: data.pips,
      rank: runData.currentRank as Rank,
    };

    addMatch(match);
    
    // Reset form
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={1}>
        <Typography variant="body2" color="text.secondary">
          Current Rank:
        </Typography>
        <Chip label={runData.currentRank} size="small" color="primary" />
      </Box>
      <Grid container spacing={3}>
        {/* Kills Selection */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="kills"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.kills}>
                <InputLabel>Kills</InputLabel>
                <Select {...field} label="Kills">
                  {[0, 1, 2, 3, 4].map(num => (
                    <MenuItem key={num} value={num}>{num} Kills</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Pips Selection */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="pips"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.pips}>
                <InputLabel>Pips Earned</InputLabel>
                <Select {...field} label="Pips Earned">
                  {[0, 1, 2].map(num => (
                    <MenuItem key={num} value={num}>{num} Pip{num !== 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
                {errors.pips && (
                  <Typography variant="caption" color="error">
                    {errors.pips.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Killer Selection */}
        <Grid item xs={12}>
          <Controller
            name="killerId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.killerId}>
                <InputLabel>Killer</InputLabel>
                <Select {...field} label="Killer">
                  <MenuItem value="">
                    <em>Select a killer</em>
                  </MenuItem>
                  {availableKillers.map(killer => (
                    <MenuItem key={killer.id} value={killer.id}>
                      {killer.name} ({killer.tier}) - ${killer.price}
                    </MenuItem>
                  ))}
                </Select>
                {errors.killerId && (
                  <Typography variant="caption" color="error">
                    {errors.killerId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
          {availableKillers.length === 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              No killers available! All are either deceased, sold, or on cooldown.
            </Alert>
          )}
        </Grid>

        {/* Perk Selection */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Perks (Optional)
          </Typography>
        </Grid>
        {[1, 2, 3, 4].map(perkNum => (
          <Grid item xs={12} sm={6} key={perkNum}>
            <Controller
              name={`perk${perkNum}` as keyof MatchFormData}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Perk {perkNum}</InputLabel>
                  <Select {...field} label={`Perk ${perkNum}`}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {allPerks.map(perk => (
                      <MenuItem key={perk.id} value={perk.id}>
                        {perk.name} - ${perk.price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        ))}

        {/* Penalties */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Penalties
          </Typography>
          <FormGroup row>
            <Controller
              name="penalties.genBeforeHook"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Gen Before Hook (-$2)"
                />
              )}
            />
            <Controller
              name="penalties.lastGenPopped"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Last Gen Popped (-$2)"
                />
              )}
            />
            <Controller
              name="penalties.doorOpened"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Door Opened (-$5)"
                />
              )}
            />
            <Controller
              name="penalties.hatchEscape"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Hatch Escape (-$4)"
                />
              )}
            />
          </FormGroup>
        </Grid>

        {/* Bonuses */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Bonuses
          </Typography>
          <FormGroup row>
            <Controller
              name="bonuses.fourGensLeft"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="4 Gens Left (+$2)"
                />
              )}
            />
            <Controller
              name="bonuses.fiveGensLeft"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="5 Gens Left (+$4)"
                />
              )}
            />
          </FormGroup>
        </Grid>

        {/* Match Preview */}
        {matchPreview && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Match Preview
                </Typography>
                <Grid container spacing={2}>
                  {/* Selected Perks Display */}
                  {(watchedValues.perk1 || watchedValues.perk2 || watchedValues.perk3 || watchedValues.perk4) && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Selected Perks
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {watchedValues.perk1 && <PerkChip perkId={watchedValues.perk1} size="small" showName={false} />}
                        {watchedValues.perk2 && <PerkChip perkId={watchedValues.perk2} size="small" showName={false} />}
                        {watchedValues.perk3 && <PerkChip perkId={watchedValues.perk3} size="small" showName={false} />}
                        {watchedValues.perk4 && <PerkChip perkId={watchedValues.perk4} size="small" showName={false} />}
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Match Cost
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(matchPreview.matchCost)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Remaining Funds
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(runData.currentFund - matchPreview.matchCost)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Kill Rewards
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {matchPreview.kills >= 4 ? '$16' : matchPreview.kills === 3 ? '$10' : '$0'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Penalties
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      {formatCurrency(matchPreview.totalPenalties)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Bonus
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {watchedValues.bonuses?.fiveGensLeft ? '5 Gens Left (+$4)' : 
                       watchedValues.bonuses?.fourGensLeft ? '4 Gens Left (+$2)' : 'None'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Pips
                    </Typography>
                    <Chip label={`+${matchPreview.pips || 0}`} size="small" color="primary" />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Killer Status
                    </Typography>
                    <Chip 
                      label={matchPreview.killerDied ? 'Dies' : 'Survives'} 
                      size="small" 
                      color={matchPreview.killerDied ? 'error' : 'success'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      New Balance
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={matchPreview.newBalance < 0 ? 'error.main' : 'success.main'}
                      fontWeight={600}
                    >
                      {formatCurrency(matchPreview.newBalance)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </>
        )}

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<Add />}
            disabled={isSubmitting || availableKillers.length === 0}
          >
            Add Match
          </Button>
        </Grid>
      </Grid>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Cannot Start Match</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
