import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
    totalReplaysAtom,
    totalPlayersAtom,
    gameVersionsAtom,
    rankDistributionAtom,
    isLoadingAtom,
    rankOrderMap,
    errorMessageAtom,
    characterWinratesAtom,  // Add this import
    GameRankDistribution,
    CharacterWinrates
} from '@/atoms/tekkenStatsAtoms';

export function useStatisticsData() {
    const [, setTotalReplays] = useAtom(totalReplaysAtom);
    const [, setTotalPlayers] = useAtom(totalPlayersAtom);
    const [, setGameVersions] = useAtom(gameVersionsAtom);
    const [, setRankDistribution] = useAtom(rankDistributionAtom);
    const [, setCharacterWinrates] = useAtom(characterWinratesAtom); 
    const [, setIsLoading] = useAtom(isLoadingAtom);
    const [, setErrorMessage] = useAtom(errorMessageAtom);

    const transformRankDistribution = (data: { [key: string]: number }, mode: 'overall' | 'standard') => {
        return Object.entries(data).map(([key, value]) => ({
            rank: rankOrderMap[parseInt(key)],
            percentage: value
        }));
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setErrorMessage('');
            try {
                // Fetch basic statistics
                const statsResponse = await fetch('http://localhost:8080/statistics/stats-summary');
                const statsData = await statsResponse.json();
                setTotalReplays(statsData.totalReplays);
                setTotalPlayers(statsData.totalPlayers);

                // Fetch character winrates
                const winratesResponse = await fetch('http://localhost:8080/statistics/top-winrates');
                const winratesData: CharacterWinrates = await winratesResponse.json();
                setCharacterWinrates(winratesData);

                // Fetch game versions
                const versionsResponse = await fetch('http://localhost:8080/statistics/gameVersions');
                const versions = await versionsResponse.json();
                setGameVersions(versions);

                // Fetch rank distribution for each version
                const distributionData: GameRankDistribution = {} as GameRankDistribution;
                for (const version of versions) {
                    distributionData[version] = {
                        overall: [],
                        standard: []
                    };

                    // Fetch overall stats
                    const overallResponse = await fetch(`http://localhost:8080/statistics/rankDistribution/${version}/overall`);
                    const overallData = await overallResponse.json();
                    distributionData[version].overall = transformRankDistribution(overallData.rankDistribution, 'overall');

                    // Fetch standard stats
                    const standardResponse = await fetch(`http://localhost:8080/statistics/rankDistribution/${version}/standard`);
                    const standardData = await standardResponse.json();
                    distributionData[version].standard = transformRankDistribution(standardData.rankDistribution, 'standard');
                }
                setRankDistribution(distributionData);
            } catch (error) {
                setErrorMessage('Failed to fetch statistics data');
                console.error('Error fetching statistics:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);
}