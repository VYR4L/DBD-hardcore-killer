import { Match, Penalty, Bonus, PenaltyType, BonusType } from '@/types';

interface MatchCalculations {
  killerDied: boolean;
  totalPenalties: number;
  bonusAmount: number;
  moneyEarned: number;
  newBalance: number;
}

const PENALTY_AMOUNTS: Record<PenaltyType, number> = {
  [PenaltyType.GEN_BEFORE_HOOK]: -2,
  [PenaltyType.LAST_GEN_POPPED]: -2,
  [PenaltyType.DOOR_OPENED]: -5,
  [PenaltyType.HATCH_ESCAPE]: -4,
};

const BONUS_AMOUNTS: Record<BonusType, number> = {
  [BonusType.FOUR_GENS_LEFT]: 2,
  [BonusType.FIVE_GENS_LEFT]: 4,
};

export const useMatchLogic = () => {
  /**
   * Determines if killer died based on kills and hatch escape
   * Rule: Killer dies if kills <= 3, unless last survivor escaped via hatch
   */
  const checkKillerDeath = (kills: number, hatchEscape: boolean): boolean => {
  if (kills <= 3 && !hatchEscape) {
  return true;
  }
  return false;
  };

  /**
   * Calculate total penalty money from penalties array
   */
  const calculateTotalPenalties = (penalties: Penalty[]): number => {
  return penalties.reduce((total, penalty) => {
  return total + (PENALTY_AMOUNTS[penalty.type] * penalty.count);
  }, 0);
  };

  /**
   * Calculate bonus money if applicable
   */
  const calculateBonus = (bonus: Bonus | null): number => {
  if (!bonus) return 0;
  return BONUS_AMOUNTS[bonus.type];
  };

  /**
   * Calculate money earned from kills (threshold-based)
   * 0-2 kills: $0
   * 3 kills: $10
   * 4 kills: $20
   */
  const calculateMoneyEarned = (kills: number): number => {
  if (kills >= 4) return 20;
  if (kills === 3) return 10;
  return 0;
  };

  /**
   * Calculate new balance after a match
   */
  const calculateNewBalance = (
  remainingFunds: number,
  penalties: Penalty[],
  bonus: Bonus | null,
  kills: number
  ): number => {
  const totalPenalties = calculateTotalPenalties(penalties);
  const bonusAmount = calculateBonus(bonus);
  const moneyEarned = calculateMoneyEarned(kills);
  
  return remainingFunds + totalPenalties + bonusAmount + moneyEarned;
  };

  /**
   * Perform all match calculations
   */
  const calculateMatchOutcome = (
  matchFunds: number,
  matchCost: number,
  kills: number,
  penalties: Penalty[],
  bonus: Bonus | null,
  hatchEscape: boolean
  ): MatchCalculations => {
  const remainingFunds = matchFunds - matchCost;
  const killerDied = checkKillerDeath(kills, hatchEscape);
  const totalPenalties = calculateTotalPenalties(penalties);
  const bonusAmount = calculateBonus(bonus);
  const moneyEarned = calculateMoneyEarned(kills);
  const newBalance = remainingFunds + totalPenalties + bonusAmount + moneyEarned;

  return {
  killerDied,
  totalPenalties,
  bonusAmount,
  moneyEarned,
  newBalance,
  };
  };

  /**
   * Check if killer should be put on cooldown
   * Rule: 2 consecutive wins = cooldown for 2 matches
   */
  const checkCooldownStatus = (
  killerId: string,
  recentMatches: Match[],
  currentMatch: Match
  ): boolean => {
  // Get last match with same killer
  const matchesWithKiller = recentMatches.filter((m: Match) => m.killerId === killerId);
  
  if (matchesWithKiller.length === 0) return false;
  
  const lastMatch = matchesWithKiller[matchesWithKiller.length - 1];
  
  // Check if both matches were wins (4 kills)
  if (lastMatch.kills === 4 && currentMatch.kills === 4) {
  return true;
  }
  
  return false;
  };

  /**
   * Validate if a match can proceed
   */
  const validateMatch = (
  currentFunds: number,
  matchCost: number,
  killerId: string,
  deadKillers: string[],
  cooldownKillers: string[]
  ): { valid: boolean; error?: string } => {
  if (currentFunds < matchCost) {
  return { valid: false, error: 'Insufficient funds. Cannot start match with negative balance.' };
  }

  if (deadKillers.includes(killerId)) {
  return { valid: false, error: 'This killer is deceased and cannot be used.' };
  }

  if (cooldownKillers.includes(killerId)) {
  return { valid: false, error: 'This killer is on cooldown and cannot be used.' };
  }

  return { valid: true };
  };

  return {
  checkKillerDeath,
  calculateTotalPenalties,
  calculateBonus,
  calculateMoneyEarned,
  calculateNewBalance,
  calculateMatchOutcome,
  checkCooldownStatus,
  validateMatch,
  };
};
