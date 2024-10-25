export interface TekkenStatsSummary {
    totalReplays: number;
    totalPlayers: number;
  }
  
  export interface RankDistributionResponse {
    rankDistribution: {
      [key: string]: number;
    };
  }