import killersData from '@assets/data/killers.json';
import perksData from '@assets/data/perks.json';
import { Killer, Perk, KillerStatus } from '@/types';

export class DataService {
  private static killers: Killer[] = [];
  private static perks: Perk[] = [];

  static initialize() {
  // Load and transform killers data
  this.killers = killersData.killers.map(killer => ({
  ...killer,
  status: KillerStatus.ALIVE,
  })) as Killer[];

  // Load perks data
  this.perks = perksData.perks as Perk[];
  }

  static getKillers(): Killer[] {
  if (this.killers.length === 0) {
  this.initialize();
  }
  return this.killers;
  }

  static getKillerById(id: string): Killer | undefined {
  if (this.killers.length === 0) {
  this.initialize();
  }
  return this.killers.find(killer => killer.id === id);
  }

  static getKillersByTier(tier: string): Killer[] {
  if (this.killers.length === 0) {
  this.initialize();
  }
  return this.killers.filter(killer => killer.tier === tier);
  }

  static getPerks(): Perk[] {
  if (this.perks.length === 0) {
  this.initialize();
  }
  return this.perks;
  }

  static getPerkById(id: string): Perk | undefined {
  if (this.perks.length === 0) {
  this.initialize();
  }
  return this.perks.find(perk => perk.id === id);
  }

  static getKillerPrice(killerId: string): number {
  const killer = this.getKillerById(killerId);
  return killer?.price || 0;
  }

  static getPerkPrice(perkId: string): number {
  const perk = this.getPerkById(perkId);
  return perk?.price || 0;
  }

  static calculateLoadoutCost(
  killerId: string,
  perkIds: (string | undefined)[]
  ): number {
  let totalCost = this.getKillerPrice(killerId);

  perkIds.forEach(perkId => {
  if (perkId) {
  totalCost += this.getPerkPrice(perkId);
  }
  });

  return totalCost;
  }
}

// Initialize on module load
DataService.initialize();
