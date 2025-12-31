import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  AttachMoney,
  Warning,
  EmojiEvents,
  LocalHospital,
  Schedule,
} from '@mui/icons-material';

const Rules: React.FC = () => {
  return (
  <Container maxWidth="lg" sx={{ py: 4 }}>
  <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
  Hardcore Killer - Season 4
  </Typography>
  <Typography variant="h5" gutterBottom color="text.secondary">
  Rules & Guidelines
  </Typography>

  <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>


  {/* Starting Conditions */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <AttachMoney color="primary" />
    <Typography variant="h6" fontWeight={600}>
    Starting Conditions
    </Typography>
    </Box>
    <List>
    <ListItem>
    <ListItemText 
      primary="Starting Balance: $20"
      secondary="Begin your journey from Ash IV to Iridescent I with this initial fund"
    />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="Loadout Rental System"
      secondary="Each match requires you to 'rent' your killer and perks based on their individual prices"
    />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="No Add-ons Allowed"
      secondary="Focus on killer and perk selection without add-on complications"
    />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Death & Cooldown Rules */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <LocalHospital color="error" />
    <Typography variant="h6" fontWeight={600}>
    Killer Death & Permadeath
    </Typography>
    </Box>
    <List>
    <ListItem>
    <ListItemText 
      primary="Death Condition"
      secondary="Killer DIES on 3 kills or less"
    />
    <Chip label="Permadeath" color="error" size="small" />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="Exception: Hatch Escape"
      secondary="If the last survivor escapes via hatch spawn, the killer survives even with 3 kills or less"
    />
    <Chip label="Exception" color="warning" size="small" />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="No Revives"
      secondary="Once a killer dies, they cannot be used again for the remainder of the season"
    />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Cooldown System */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <Schedule color="warning" />
    <Typography variant="h6" fontWeight={600}>
    Killer Cooldown System
    </Typography>
    </Box>
    <List>
    <ListItem>
    <ListItemText 
      primary="Cooldown Trigger"
      secondary="After 2 consecutive wins with the same killer"
    />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="Cooldown Duration"
      secondary="Killer cannot be used for the next 2 matches"
    />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="Purpose"
      secondary="Prevents exploiting cheap killer loadouts and promotes roster diversity"
    />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Financial Rules */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <AttachMoney color="success" />
    <Typography variant="h6" fontWeight={600}>
    Financial Management
    </Typography>
    </Box>
    <List>
    <ListItem>
    <ListItemText 
      primary="Bankruptcy Prevention"
      secondary="Cannot enter a new match with negative money"
    />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="Killer Sales"
      secondary="Alive killers can be sold for their face value to regain funds (e.g., Nurse worth $20 can be sold for $20)"
    />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Penalties */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <Warning color="error" />
    <Typography variant="h6" fontWeight={600}>
    Penalties
    </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" mb={2}>
    Penalties are applied when any of the following occurs:
    </Typography>
    <List>
    <ListItem>
    <ListItemText primary="Gen pops before first hook: -$2" />
    </ListItem>
    <ListItem>
    <ListItemText primary="Last gen completed: -$2" />
    </ListItem>
    <ListItem>
    <ListItemText primary="Exit door opened: -$5" />
    </ListItem>
    <ListItem>
    <ListItemText primary="Survivor escapes through hatch: -$4" />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Bonuses */}
  <Card>
    <CardContent>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
    <EmojiEvents color="primary" />
    <Typography variant="h6" fontWeight={600}>
    Bonus Rewards
    </Typography>
    </Box>
    <List>
    <ListItem>
    <ListItemText 
      primary="4 Gens Remaining"
      secondary="Gain +$2 if match ends with 4 generators left"
    />
    <Chip label="+$2" color="success" size="small" />
    </ListItem>
    <ListItem>
    <ListItemText 
      primary="5 Gens Remaining"
      secondary="Gain +$4 if match ends with 5 generators left (perfect game)"
    />
    <Chip label="+$4" color="success" size="small" />
    </ListItem>
    </List>
    </CardContent>
  </Card>

  {/* Victory Conditions */}
  <Card sx={{ 
    background: 'linear-gradient(135deg, rgba(166, 0, 206, 0.1) 0%, rgba(138, 0, 171, 0.05) 100%)',
  }}>
    <CardContent>
    <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
    🏆 Victory Condition
    </Typography>
    <Typography variant="body1">
    Successfully reach <strong>Iridescent I</strong> rank without losing all your killers
    or going bankrupt. Balance aggressive gameplay with strategic financial management!
    </Typography>
    </CardContent>
  </Card>
  </Box>
  </Container>
  );
};

export default Rules;
