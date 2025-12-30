// Enums
export enum KillerTier {
  BOTTOM = 'Bottom Tier',
  LOW = 'Low Tier',
  MID = 'Mid Tier',
  TOP = 'Top Tier',
}

export enum KillerStatus {
  ALIVE = 'Alive',
  COOLDOWN = 'Cooldown',
  DECEASED = 'Deceased',
  SOLD = 'Sold',
}

export enum Rank {
  ASH_IV = 'Ash IV',
  ASH_III = 'Ash III',
  ASH_II = 'Ash II',
  ASH_I = 'Ash I',
  BRONZE_IV = 'Bronze IV',
  BRONZE_III = 'Bronze III',
  BRONZE_II = 'Bronze II',
  BRONZE_I = 'Bronze I',
  SILVER_IV = 'Silver IV',
  SILVER_III = 'Silver III',
  SILVER_II = 'Silver II',
  SILVER_I = 'Silver I',
  GOLD_IV = 'Gold IV',
  GOLD_III = 'Gold III',
  GOLD_II = 'Gold II',
  GOLD_I = 'Gold I',
  IRIDESCENT_IV = 'Iridescent IV',
  IRIDESCENT_III = 'Iridescent III',
  IRIDESCENT_II = 'Iridescent II',
  IRIDESCENT_I = 'Iridescent I',
}

export enum RankCategory {
  ASH = 'Ash',
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  IRIDESCENT = 'Iridescent',
  COMBINED = 'Combined',
}

export enum PenaltyType {
  GEN_BEFORE_HOOK = 'Gen b4 Hook',
  LAST_GEN_POPPED = 'Last Gen Popped',
  DOOR_OPENED = 'Door Opened',
  HATCH_ESCAPE = 'Hatch Escape',
}

export enum BonusType {
  FOUR_GENS_LEFT = '4 Gens Left',
  FIVE_GENS_LEFT = '5 Gens Left',
}

// Interfaces
export interface Killer {
  id: string;
  name: string;
  tier: KillerTier;
  price: number;
  status: KillerStatus;
}

export interface Perk {
  id: string;
  name: string;
  price: number;
}

export interface Penalty {
  type: PenaltyType;
  amount: number;
  count: number;
}

export interface Bonus {
  type: BonusType;
  amount: number;
}

export interface Match {
  matchNumber: number;
  matchFunds: number;
  killerId: string;
  killerName: string;
  perks: {
  perk1Id?: string;
  perk2Id?: string;
  perk3Id?: string;
  perk4Id?: string;
  };
  matchCost: number;
  remainingFunds: number;
  penalties: Penalty[];
  totalPenalties: number;
  kills: number;
  killerDied: boolean;
  bonus: Bonus | null;
  newBalance: number;
  pips: number;
  rank: Rank;
}

export interface Sale {
  grade: Rank;
  nextMatchNumber: number;
  killersSold: string[];
  moneyGained: number;
  newCurrentFunds: number;
}

export interface RankStats {
  startingBalance: number;
  totalMatches: number;
  perkSlotsUsed: number;
  genBeforeHook: number;
  lastGenPopped: number;
  doorOpened: number;
  hatchEscape: number;
  totalPenalties: number;
  fourGensLeft: number;
  fiveGensLeft: number;
  totalBonusMoney: number;
  moneySpentOnMatches: number;
  totalKills: number;
  moneyEarned: number;
  penaltyMoneyLost: number;
  differentKillersUsed: number;
  killersThatDied: number;
  killersSold: number;
  moneyGainedFromSales: number;
  endingGradeBalance: number;
}

export interface RunData {
  currentFund: number;
  currentRank: string;
  accumulatedPips: number;
  cooldownKillers: string[];
  deadKillers: string[];
  soldKillers: string[];
  stats: Record<RankCategory, RankStats>;
  matches: Match[];
  sales: Sale[];
}

export interface KillerSummary {
  alive: Killer[];
  cooldown: Killer[];
  deceased: Killer[];
  sold: Killer[];
}
