import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RunData, Match, Sale, RankCategory, RankStats, Killer, Rank } from '@/types';

interface RunContextType {
  runData: RunData;
  addMatch: (match: Match) => void;
  addSale: (sale: Sale) => void;
  updateCurrentFund: (amount: number) => void;
  getKillerById: (id: string) => Killer | undefined;
  resetRun: () => void;
}

const RunContext = createContext<RunContextType | undefined>(undefined);

// Rank progression helper
const calculateRankProgression = (currentRank: string, totalPips: number): { newRank: string; remainingPips: number } => {
  const rankOrder = [
    Rank.ASH_IV, Rank.ASH_III, Rank.ASH_II, Rank.ASH_I,
    Rank.BRONZE_IV, Rank.BRONZE_III, Rank.BRONZE_II, Rank.BRONZE_I,
    Rank.SILVER_IV, Rank.SILVER_III, Rank.SILVER_II, Rank.SILVER_I,
    Rank.GOLD_IV, Rank.GOLD_III, Rank.GOLD_II, Rank.GOLD_I,
    Rank.IRIDESCENT_IV, Rank.IRIDESCENT_III, Rank.IRIDESCENT_II, Rank.IRIDESCENT_I,
  ];

  const getPipsRequired = (rank: string): number => {
    if (rank === Rank.ASH_IV || rank === Rank.ASH_III) return 3;
    if (rank === Rank.ASH_II || rank === Rank.ASH_I || 
        rank === Rank.BRONZE_IV || rank === Rank.BRONZE_III || 
        rank === Rank.BRONZE_II || rank === Rank.BRONZE_I) return 4;
    return 5; // Silver to Iridescent
  };

  let currentRankIndex = rankOrder.indexOf(currentRank as Rank);
  let remainingPips = totalPips;

  // Can't find rank or already at max
  if (currentRankIndex === -1 || currentRankIndex === rankOrder.length - 1) {
    return { newRank: currentRank, remainingPips: totalPips };
  }

  // Progress through ranks
  while (remainingPips > 0 && currentRankIndex < rankOrder.length - 1) {
    const pipsNeeded = getPipsRequired(rankOrder[currentRankIndex]);
    
    if (remainingPips >= pipsNeeded) {
      remainingPips -= pipsNeeded;
      currentRankIndex++;
    } else {
      break;
    }
  }

  return {
    newRank: rankOrder[currentRankIndex],
    remainingPips,
  };
};

const INITIAL_STATS: RankStats = {
  startingBalance: 0,
  totalMatches: 0,
  perkSlotsUsed: 0,
  genBeforeHook: 0,
  lastGenPopped: 0,
  doorOpened: 0,
  hatchEscape: 0,
  totalPenalties: 0,
  fourGensLeft: 0,
  fiveGensLeft: 0,
  totalBonusMoney: 0,
  moneySpentOnMatches: 0,
  totalKills: 0,
  moneyEarned: 0,
  penaltyMoneyLost: 0,
  differentKillersUsed: 0,
  killersThatDied: 0,
  killersSold: 0,
  moneyGainedFromSales: 0,
  endingGradeBalance: 0,
};

const INITIAL_RUN_DATA: RunData = {
  currentFund: 20,
  currentRank: 'Ash IV' as any,
  accumulatedPips: 0,
  cooldownKillers: [],
  deadKillers: [],
  soldKillers: [],
  stats: {
  [RankCategory.ASH]: { ...INITIAL_STATS, startingBalance: 20 },
  [RankCategory.BRONZE]: { ...INITIAL_STATS },
  [RankCategory.SILVER]: { ...INITIAL_STATS },
  [RankCategory.GOLD]: { ...INITIAL_STATS },
  [RankCategory.IRIDESCENT]: { ...INITIAL_STATS },
  [RankCategory.COMBINED]: { ...INITIAL_STATS, startingBalance: 20 },
  },
  matches: [],
  sales: [],
};

interface RunProviderProps {
  children: ReactNode;
}

export const RunProvider: React.FC<RunProviderProps> = ({ children }) => {
  const [runData, setRunData] = useState<RunData>(() => {
  const savedData = localStorage.getItem('runData');
  return savedData ? JSON.parse(savedData) : INITIAL_RUN_DATA;
  });

  useEffect(() => {
  localStorage.setItem('runData', JSON.stringify(runData));
  }, [runData]);

  const addMatch = (match: Match) => {
    setRunData((prev) => {
      const newAccumulatedPips = prev.accumulatedPips + match.pips;
      const { newRank, remainingPips } = calculateRankProgression(prev.currentRank, newAccumulatedPips);
      
      // Check for cooldown: 2 consecutive wins with same killer (win = killer didn't die)
      const lastMatch = prev.matches.length > 0 ? prev.matches[prev.matches.length - 1] : null;
      const shouldCooldown = lastMatch && 
                             lastMatch.killerId === match.killerId && 
                             !lastMatch.killerDied &&
                             !match.killerDied;
      
      // Process cooldown list
      let newCooldownKillers = [...prev.cooldownKillers];
      
      // Add to cooldown if conditions met
      if (shouldCooldown) {
        // Store with match count when added to cooldown
        if (!newCooldownKillers.includes(match.killerId)) {
          newCooldownKillers.push(match.killerId);
        }
      }
      
      // Remove killers from cooldown after 2 matches have been played since they were added
      // We need to track when each killer was added to cooldown
      // For simplicity, check if 2 different killers have been played since
      const currentMatchCount = prev.matches.length;
      newCooldownKillers = newCooldownKillers.filter(cooldownKillerId => {
        // Find when this killer was added to cooldown (when it had 2 consecutive wins)
        let cooldownStartIndex = -1;
        for (let i = prev.matches.length - 1; i >= 1; i--) {
          const m1 = prev.matches[i - 1];
          const m2 = prev.matches[i];
          if (m1.killerId === cooldownKillerId && 
              m2.killerId === cooldownKillerId && 
              !m1.killerDied &&
              !m2.killerDied) {
            cooldownStartIndex = i;
            break;
          }
        }
        
        // If we found when it went on cooldown, check if 2 OTHER matches have been played
        if (cooldownStartIndex !== -1) {
          const matchesSinceCooldown = currentMatchCount - cooldownStartIndex;
          return matchesSinceCooldown < 2;
        }
        
        // Keep in cooldown if we can't find when it was added (safety)
        return true;
      });
      
      return {
        ...prev,
        matches: [...prev.matches, match],
        currentFund: match.newBalance,
        currentRank: newRank,
        accumulatedPips: remainingPips,
        cooldownKillers: newCooldownKillers,
        deadKillers: match.killerDied 
          ? [...prev.deadKillers, match.killerId]
          : prev.deadKillers,
      };
    });
  };

  const addSale = (sale: Sale) => {
  setRunData((prev) => ({
  ...prev,
  sales: [...prev.sales, sale],
  currentFund: sale.newCurrentFunds,
  soldKillers: [...prev.soldKillers, ...sale.killersSold],
  }));
  };

  const updateCurrentFund = (amount: number) => {
  setRunData((prev) => ({
  ...prev,
  currentFund: amount,
  }));
  };

  const getKillerById = (_id: string): Killer | undefined => {
  // This will be implemented when we have the killers data
  return undefined;
  };

  const resetRun = () => {
  setRunData(INITIAL_RUN_DATA);
  localStorage.removeItem('runData');
  };

  return (
  <RunContext.Provider
  value={{
  runData,
  addMatch,
  addSale,
  updateCurrentFund,
  getKillerById,
  resetRun,
  }}
  >
  {children}
  </RunContext.Provider>
  );
};

export const useRun = (): RunContextType => {
  const context = useContext(RunContext);
  if (!context) {
  throw new Error('useRun must be used within a RunProvider');
  }
  return context;
};
