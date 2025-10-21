
export interface HomeContentProps {
    initialData: HomepageData;
}

export interface HomepageData {
    "30d_pickrates": PickrateEntry[];
    "30d_winrates": WinrateEntry[];
    "30d_trends": TrendEntry[];
    "ver_pickrates": PickrateEntry[];
    "ver_winrates": WinrateEntry[];
    "ver_trends": TrendEntry[];
    "active_players": ActivePlayerRegion[];
    "ver_distribution": VersionDistribution[];
    "30d_rank_distib": RankDistributionEntry[];
}

export interface HomeContentProps {
    initialData: HomepageData;
}

export interface PickrateEntry {
    tkChar: string;
    game_version: number | null;
    total_battles: number;
    pick_rate: number;
}

export interface WinrateEntry {
    tkChar: string;
    game_version: number | null;
    total_wins: number;
    total_games: number;
    win_rate: number;
}

export interface TrendEntry {
    // Define when backend provides this
}

export interface ActivePlayerRegion {
    region: string;
    count: number;
}

export interface RankDistributionEntry {
    dan_rank: number;
    player_count: number;
    percentage: number;
    cumulative_percentage: number;
}

export interface VersionDistribution {
    distribution_type: string;
    game_version: number;
    as_of_date: string | null;
    entries: RankDistributionEntry[];
}