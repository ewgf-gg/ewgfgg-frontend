import { Metadata } from 'next'

type Props = {
  params: { polarisId: string }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Fetch player data
  const response = await fetch(`${process.env.API_URL}/api/player-stats/${params.polarisId}`)
  const playerData = await response.json()

  if (!playerData) {
    return {
      title: 'Player Not Found',
      description: 'The requested player profile could not be found.'
    }
  }

  const mainChar = playerData.mainCharacterAndRank?.characterName || 'Unknown Character'
  const rank = playerData.mainCharacterAndRank?.danRank || 'Unknown Rank'
  const region = playerData.regionId ? `Region ${playerData.regionId}` : 'Unknown Region'
  const area = playerData.areaId 

  return {
    title: `${playerData.name}'s Tekken 8 Profile`,
    description: `View ${playerData.name}'s Tekken 8 profile. Main: ${mainChar} | Rank: ${rank} | ${region} ${area}`,
    openGraph: {
      title: `${playerData.name}'s Tekken 8 Profile`,
      description: `View ${playerData.name}'s Tekken 8 profile. Main: ${mainChar} | Rank: ${rank} | ${region} ${area}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${playerData.name}'s Tekken 8 Profile`,
      description: `View ${playerData.name}'s Tekken 8 profile. Main: ${mainChar} | Rank: ${rank} | ${region} ${area}`,
    }
  }
}

export default function PlayerLayout({ children }: Props) {
  return children
}
