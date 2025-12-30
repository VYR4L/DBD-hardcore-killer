# Hardcore Killer - Season 4

A comprehensive Dead by Daylight challenge management system built with React, TypeScript, and Material UI. Track your hardcore killer runs from Ash IV to Iridescent I with detailed statistics, killer management, and financial tracking.

**Created for the [SpookyLoopz](https://www.twitch.tv/spookyloopz) "Hardcore Killer" series** - a thrilling Dead by Daylight challenge where every decision matters and every killer's life is on the line.

## 🎮 Features

- **Dark/Horror Theme** with purple accent (#A600CE)
- **Killer Management** - Track alive, cooldown, deceased, and sold killers
- **Match Tracking** - Detailed match-by-match statistics
- **Financial System** - Track income, expenses, penalties, and bonuses
- **Rank Progression** - Comprehensive stats broken down by rank
- **Permadeath System** - Killers die on 3 kills or less (unless hatch escape)
- **Cooldown Mechanic** - Prevents killer spam with 2-match cooldown
- **Market System** - Sell killers for their face value

## 🛠 Tech Stack

- **React 18+** with TypeScript
- **Vite** for blazing-fast development
- **Material UI v5+** for UI components
- **React Router** for navigation
- **React Hook Form** + **Zod** for form validation
- **Context API** for state management
- **Local Storage** for data persistence

## 📂 Project Structure

```
src/
├── assets/
│   ├── data/
│   │   ├── killers.json        # 41 killers across 4 tiers
│   │   └── perks.json          # 128 perks with pricing
│   └── images/                 # Static images (banner, etc.)
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   ├── StatusChip.tsx      # Killer status chips
│   │   ├── CurrencyChip.tsx    # Money display
│   │   └── ThemeToggle.tsx     # Dark/Light mode switch
│   ├── molecules/
│   │   ├── StatCard.tsx        # Summary statistics cards
│   │   └── Breadcrumbs.tsx     # Navigation breadcrumbs
│   └── organisms/
│       ├── Navbar.tsx          # Main navigation
│       └── GlobalFooter.tsx    # Footer component
├── context/
│   ├── ThemeContext.tsx        # Theme state management
│   └── RunContext.tsx          # Run data & rank progression
├── hooks/
│   ├── useMatchLogic.ts        # Match calculations & validation
│   └── useCurrency.ts          # Currency formatting
├── pages/
│   ├── Rules/
│   │   └── Rules.tsx           # Game rules & guidelines
│   ├── Pricing/
│   │   └── Pricing.tsx         # Killer/perk pricing reference
│   ├── CurrentRun/
│   │   ├── CurrentRun.tsx
│   │   └── components/
│   │       ├── KillerStatusDisplay.tsx    # Alive/Cooldown/Dead/Sold
│   │       ├── MatchEntryForm.tsx         # Add new match form
│   │       ├── MatchHistoryTable.tsx      # Match history
│   │       └── RunSummary.tsx             # Run statistics
│   ├── Market/
│   │   ├── Market.tsx
│   │   └── components/
│   │       └── SellKillersForm.tsx        # Sell killers interface
│   └── RankStatus/
│       └── RankStatus.tsx      # Statistics by rank category
├── services/
│   └── DataService.ts          # Singleton for data loading
├── theme/
│   └── theme.ts                # MUI theme configuration
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/                      # Helper functions
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Game Rules

### Starting Conditions
- Begin with **$20**
- Each killer and perk must be "rented" for each match
- No add-ons allowed
- Goal: Reach Iridescent I without bankruptcy or losing all killers

### Killer Death
- Killer **dies** on **3 kills or less**
- Exception: Last survivor escapes via hatch
- Death is permanent (no revives)

### Cooldown System
- **2 consecutive wins** (4 kills each) = cooldown
- Cooldown duration: **2 matches**
- Prevents exploiting cheap killers

### Financial Rules
- Cannot start a match with negative balance
- Sell alive killers for face value to regain funds
- Each kill earns **$5**

### Penalties
- Gen before first hook: **-$3**
- Last gen completed: **-$5**
- Door opened: **-$5**
- Hatch escape: **-$5**

### Bonuses
- 4 gens remaining: **+$2**
- 5 gens remaining: **+$4**

## 🎨 Design System

### Color Palette
- **Primary**: #A600CE (Purple)
- **Dark Background**: #0A0A0A
- **Dark Paper**: #161616
- **Light Background**: #F5F5F5
- **Light Paper**: #FFFFFF

### Typography
- Font Family: Roboto, Helvetica, Arial
- Headers: Bold weights (600-700)
- Body: Regular weight (400)

## 📊 Data Structure

The application uses local storage to persist run data:

```json
{
  "current_fund": 20,
  "cooldown_killers": ["id1", "id2"],
  "dead_killers": ["id3"],
  "sold_killers": ["id4"],
  "stats": {
    "Ash": { /* rank statistics */ },
    "Bronze": { /* rank statistics */ },
    // ... other ranks
  },
  "matches": [ /* match history */ ],
  "sales": [ /* sale history */ ]
}
```

## 🔮 Future Enhancements

- Import/Export run data
- Multiple run profiles
- Advanced statistics and charts
- Achievement system
- Community leaderboards

## 📄 License

This project is for educational and personal use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with 💜 for Dead by Daylight players
