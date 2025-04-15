# EWGF.GG - Tekken 8 Statistics Website (Frontend)

This is the front-end service that runs [ewgf.gg](https://www.ewgf.gg/). It is designed to visualize and display TEKKEN 8 data that has been collected from the Wavu Wank api.
> **Note: To run this locally, you MUST have the backend server running at the configured API_URL before starting the frontend application. See the backend repository for setup instructions.**

## Front Page
![Front Page](https://github.com/user-attachments/assets/d746c813-7cd1-41a3-b14d-2c6a0ee21807)

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm 

### Installation Steps
1. Clone the repository
   ```bash
   git clone https://github.com/ewgf-gg/ewgfgg-frontend.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=http://localhost:8080
   ```

4. Start the development server
   ```bash
   npm run dev
   ```



## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              
│   ├── player/           # Player profile page
│   ├── statistics/       # Statistics page
│   ├── state/            
│   │   ├── atoms/        # Jotai atoms
│   │   └── types/        # Type definitions
├── components/           
│   ├── homepage-charts/  # Chart Components for the homepage
│   ├── player-charts/    # Chart Components for player statitics page
│   ├── player-stats/     # Components for player statistics page
│   ├── shared/           # Shared generic components
│   ├── statistics/       # Statistics page components
│   └── ui/               # Shared UI components
├── lib/                  # Utility functions and API clients
│   └── hooks/            # Custom React hooks
├── static/               # Static assets
│   ├── character-icons/  # Character icons
│   ├── rank-icons/       # Rank icons
│   └── tekken-inputs/    # Tekken input icons
```

## Libraries/Frameworks Used

- **Next.js**
- **TypeScript**
- **React**
- **Jotai**
- **Recharts**
- **Framer Motion**
- **Tailwind CSS**
- **shadcn/ui**

## API Endpoints

The frontend communicates with the backend API that provides the following endpoints:

- `/player-stats/{polarisId}` - Get detailed stats for a specific player
- `/player-stats/search` - Search for players by name or TEKKEN-ID
- `/statistics/stats-summary` - Get summary statistics (total players, replays)
- `/statistics/top-winrates` - Get top 5 character win rates
- `/statistics/top-popularity` - Get top 5 character popularity
- `/statistics/winrate-changes` - Get character win rate changes
- `/statistics/rankDistribution` - Get rank distribution data
- `/statistics/version-popularity` - Get character popularity by game version
- `/statistics/version-winrates` - Get character win rates by game version

## Contributing

Contributions are appreciated and welcome! Please feel free to submit a pull request :) 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).
