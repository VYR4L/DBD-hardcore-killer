import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { RankCategory, PenaltyType, BonusType } from '@/types';
import { useRun } from '@/context/RunContext';
import { useCurrency } from '@/hooks/useCurrency';
import { RankChip } from '@components/atoms/RankChip';

const RankStatus: React.FC = () => {
  const theme = useTheme();
  const { runData } = useRun();
  const { formatCurrency } = useCurrency();

  // Calculate stats for each rank category
  const calculateStats = (rankCategory: RankCategory) => {
    const categoryMatches = runData.matches.filter(match => {
      if (rankCategory === RankCategory.COMBINED) return true;
      const matchRank = match.rank;
      return matchRank.includes(rankCategory);
    });

    const startingBalance = categoryMatches.length > 0 ? categoryMatches[0].matchFunds : 0;
    const totalMatches = categoryMatches.length;
    const perkSlotsUsed = categoryMatches.reduce((sum, match) => {
      return sum + Object.values(match.perks).filter(Boolean).length;
    }, 0);
    
    const genBeforeHook = categoryMatches.reduce((sum, match) => 
      sum + match.penalties.filter(p => p.type === PenaltyType.GEN_BEFORE_HOOK).length, 0);
    const lastGenPopped = categoryMatches.reduce((sum, match) => 
      sum + match.penalties.filter(p => p.type === PenaltyType.LAST_GEN_POPPED).length, 0);
    const doorOpened = categoryMatches.reduce((sum, match) => 
      sum + match.penalties.filter(p => p.type === PenaltyType.DOOR_OPENED).length, 0);
    const hatchEscape = categoryMatches.reduce((sum, match) => 
      sum + match.penalties.filter(p => p.type === PenaltyType.HATCH_ESCAPE).length, 0);
    
    const totalPenalties = categoryMatches.reduce((sum, match) => sum + match.totalPenalties, 0);
    
    const fourGensLeft = categoryMatches.reduce((sum, match) => 
      match.bonus?.type === BonusType.FOUR_GENS_LEFT ? sum + 1 : sum, 0);
    const fiveGensLeft = categoryMatches.reduce((sum, match) => 
      match.bonus?.type === BonusType.FIVE_GENS_LEFT ? sum + 1 : sum, 0);
    const totalBonusMoney = categoryMatches.reduce((sum, match) => 
      sum + (match.bonus?.amount || 0), 0);
    
    const moneySpentOnMatches = categoryMatches.reduce((sum, match) => sum + match.matchCost, 0);
    const totalKills = categoryMatches.reduce((sum, match) => sum + match.kills, 0);
    const moneyEarned = totalKills * 5;
    const penaltyMoneyLost = Math.abs(totalPenalties);
    
    const differentKillersUsed = new Set(categoryMatches.map(m => m.killerId)).size;
    const killersThatDied = categoryMatches.filter(m => m.killerDied).length;
    
    const categorySales = runData.sales.filter(sale => {
      if (rankCategory === RankCategory.COMBINED) return true;
      return sale.grade.includes(rankCategory);
    });
    const killersSold = categorySales.reduce((sum, sale) => sum + sale.killersSold.length, 0);
    const moneyGainedFromSales = categorySales.reduce((sum, sale) => sum + sale.moneyGained, 0);
    
    const endingGradeBalance = categoryMatches.length > 0 
      ? categoryMatches[categoryMatches.length - 1].newBalance 
      : startingBalance;

    return {
      startingBalance,
      totalMatches,
      perkSlotsUsed,
      genBeforeHook,
      lastGenPopped,
      doorOpened,
      hatchEscape,
      totalPenalties,
      fourGensLeft,
      fiveGensLeft,
      totalBonusMoney,
      moneySpentOnMatches,
      totalKills,
      moneyEarned,
      penaltyMoneyLost,
      differentKillersUsed,
      killersThatDied,
      killersSold,
      moneyGainedFromSales,
      endingGradeBalance,
    };
  };

  const stats = [
  'Starting Balance',
  'Total Matches',
  '# of Perk Slots Used',
  'Gen b4 Hook',
  'Last Gen Popped',
  'Door Opened',
  'Hatch Escape',
  'Total Penalties',
  '4 Gens Left',
  '5 Gens Left',
  'Total Bonus $',
  'Money Spent on Matches',
  'Total Kills',
  'Money Earned',
  'Penalty $ Lost',
  '# of Diff Killers Used',
  'Killers that Died',
  'Killers Sold',
  'Money Gained from Sales',
  'Ending Grade Balance',
  ];

  const ranks = [
  RankCategory.ASH,
  RankCategory.BRONZE,
  RankCategory.SILVER,
  RankCategory.GOLD,
  RankCategory.IRIDESCENT,
  RankCategory.COMBINED,
  ];

  const rankStats: Record<RankCategory, any> = {
    [RankCategory.ASH]: calculateStats(RankCategory.ASH),
    [RankCategory.BRONZE]: calculateStats(RankCategory.BRONZE),
    [RankCategory.SILVER]: calculateStats(RankCategory.SILVER),
    [RankCategory.GOLD]: calculateStats(RankCategory.GOLD),
    [RankCategory.IRIDESCENT]: calculateStats(RankCategory.IRIDESCENT),
    [RankCategory.COMBINED]: calculateStats(RankCategory.COMBINED),
  };

  const getStatValue = (statName: string, rank: RankCategory) => {
    const data = rankStats[rank];
    switch (statName) {
      case 'Starting Balance': return formatCurrency(data.startingBalance);
      case 'Total Matches': return data.totalMatches;
      case '# of Perk Slots Used': return data.perkSlotsUsed;
      case 'Gen b4 Hook': return data.genBeforeHook;
      case 'Last Gen Popped': return data.lastGenPopped;
      case 'Door Opened': return data.doorOpened;
      case 'Hatch Escape': return data.hatchEscape;
      case 'Total Penalties': return formatCurrency(data.totalPenalties);
      case '4 Gens Left': return data.fourGensLeft;
      case '5 Gens Left': return data.fiveGensLeft;
      case 'Total Bonus $': return formatCurrency(data.totalBonusMoney);
      case 'Money Spent on Matches': return formatCurrency(data.moneySpentOnMatches);
      case 'Total Kills': return data.totalKills;
      case 'Money Earned': return formatCurrency(data.moneyEarned);
      case 'Penalty $ Lost': return formatCurrency(data.penaltyMoneyLost);
      case '# of Diff Killers Used': return data.differentKillersUsed;
      case 'Killers that Died': return data.killersThatDied;
      case 'Killers Sold': return data.killersSold;
      case 'Money Gained from Sales': return formatCurrency(data.moneyGainedFromSales);
      case 'Ending Grade Balance': return formatCurrency(data.endingGradeBalance);
      default: return '-';
    }
  };

  const getRankColor = (rank: string) => {
  switch (rank) {
  case RankCategory.ASH:
  return theme.palette.grey[600];
  case RankCategory.BRONZE:
  return '#CD7F32';
  case RankCategory.SILVER:
  return '#C0C0C0';
  case RankCategory.GOLD:
  return '#FFD700';
  case RankCategory.IRIDESCENT:
  return theme.palette.primary.main;
  case RankCategory.COMBINED:
  return theme.palette.secondary.main;
  default:
  return theme.palette.text.primary;
  }
  };

  return (
  <Container maxWidth="xl" sx={{ py: 4 }}>
  <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
  Rank Status
  </Typography>
  <Typography variant="body1" color="text.secondary" paragraph>
  Comprehensive statistics broken down by rank progression
  </Typography>

  <Box sx={{ mt: 4 }}>
  <Card>
    <CardContent sx={{ p: 0 }}>
    <TableContainer sx={{ maxHeight: 800 }}>
    <Table stickyHeader>
    <TableHead>
      <TableRow>
      <TableCell 
      sx={{ 
      fontWeight: 700,
      minWidth: 200,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: 3,
      }}
      >
      Stat
      </TableCell>
      {ranks.map((rank) => (
      <TableCell 
      key={rank} 
      align="center"
      sx={{ 
        fontWeight: 700,
        minWidth: 120,
      }}
      >
      {rank === RankCategory.COMBINED ? (
        <Typography variant="body2" fontWeight={700} color={getRankColor(rank)}>
          {rank}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <RankChip rank={rank} size="small" showLabel={false} />
        </Box>
      )}
      </TableCell>
      ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {stats.map((stat, index) => (
      <TableRow 
      key={stat}
      sx={{
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      }}
      >
      <TableCell 
      component="th" 
      scope="row"
      sx={{ 
        fontWeight: 600,
        position: 'sticky',
        left: 0,
        backgroundColor: index % 2 === 0 
        ? theme.palette.action.hover 
        : theme.palette.background.paper,
        zIndex: 2,
      }}
      >
      {stat}
      </TableCell>
      {ranks.map((rank) => (
      <TableCell key={`${stat}-${rank}`} align="center">
        {getStatValue(stat, rank)}
      </TableCell>
      ))}
      </TableRow>
      ))}
    </TableBody>
    </Table>
    </TableContainer>
    </CardContent>
  </Card>
  </Box>

  <Box sx={{ mt: 4 }}>
  <Card sx={{ 
    background: 'linear-gradient(135deg, rgba(166, 0, 206, 0.1) 0%, rgba(138, 0, 171, 0.05) 100%)',
  }}>
    <CardContent>
    <Typography variant="h6" gutterBottom fontWeight={600}>
    📊 Statistics Info
    </Typography>
    <Typography variant="body2" color="text.secondary">
    All statistics are automatically calculated and updated as you progress through matches.
    The "Combined" column shows cumulative totals across all ranks.
    </Typography>
    </CardContent>
  </Card>
  </Box>
  </Container>
  );
};

export default RankStatus;
