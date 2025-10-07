import { Metadata } from 'next'
import { characterIconMap, rankIconMap, Regions } from '@/app/state/types/tekkenTypes'
import { PlayerMetadata } from '@/app/state/types/PlayerPageTypes'

function formatPolarisId(rawPolarisId: string): string {
  if (!rawPolarisId || rawPolarisId.length < 12) return rawPolarisId;
  
  try {
    return `${rawPolarisId.substring(0, 4)}-${rawPolarisId.substring(4, 8)}-${rawPolarisId.substring(8)}`;
  } catch (error) {
    console.error("Error formatting Polaris ID:", error);
    return rawPolarisId;
  }
}

export const revalidate = 30;

type Props = {
  params: { polarisId: string }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Fetch player data
  const response = await fetch(`${process.env.API_URL}/player-stats/metaData/${params.polarisId}`)
  const playerData: PlayerMetadata = await response.json()

  if (!playerData) {
    return {
      title: 'Player Not Found',
      description: 'The requested player profile could not be found.'
    }
  }

  // The new API endpoint needs to return mainChar data separately since it's not in PlayerMetadata
  // For now, we'll fetch the full player stats to get main character info
  const statsResponse = await fetch(`${process.env.API_URL}/player-stats/${params.polarisId}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    }
  })
  
  let mainChar = ''
  let rank = ''
  
  if (statsResponse.ok) {
    const statsData = await statsResponse.json()
    // mainChar is Record<string, string> like {"Alisa": "BUSHIN"}
    if (statsData.mainChar && typeof statsData.mainChar === 'object') {
      const entries = Object.entries(statsData.mainChar)
      if (entries.length > 0) {
        mainChar = entries[0][0] // Character name
        rank = typeof entries[0][1] === 'string' ? entries[0][1] : '' // Rank name
      }
    }
  }
  
  const region = playerData.region || ''
  const polarisId = playerData.polarisId ? formatPolarisId(playerData.polarisId) : ''
  const characterIcon = characterIconMap[mainChar] || ''
  const rankIcon = rankIconMap[rank] || ''
  
  const title = `${playerData.name}'s Tekken 8 Profile`
  const description = `Tekken-ID: ${polarisId} \n Tekken 8 Stats\n \n🥋 Main: ${mainChar}\n👑 Rank: ${rank}\n🌎 Region: ${region}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [characterIcon, rankIcon],
      siteName: 'EWGF.GG',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [characterIcon],
    }
  }
}

export default function PlayerLayout({ children }: Props) {
  return children
}
