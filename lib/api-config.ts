interface APIConfig {
  baseURL: string;
  headers: {
    Authorization?: string;
    Accept?: string;
    'Cache-Control'?: string;
  };
}

export function getAPIConfig(): APIConfig {
  const baseURL = process.env.API_URL || 'http://localhost:8080';
  const apiKey = process.env.API_KEY;
  
  const defaultHeaders: APIConfig['headers'] = {
    'Accept': 'application/json'
  };

  if (apiKey) {
    defaultHeaders.Authorization = `Bearer ${apiKey}`;
  }

  return {
    baseURL,
    headers: defaultHeaders
  };
}

export async function fetchWithConfig(endpoint: string, options: RequestInit = {}) {
  const config = getAPIConfig();
  
  // eslint-disable-next-line
  const nextOptions = (options as any).next || {};
  
  const response = await fetch(`${config.baseURL}${endpoint}`, {
    ...options,
    headers: {
      ...config.headers,
      ...options.headers
    },
    next: {
      revalidate: 30,
      ...nextOptions
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    // Create error message that includes the status code for proper error page detection
    let errorMessage = `${response.status}`;
    
    // Add specific error type based on status code
    if (response.status === 500) {
      errorMessage = '500 Internal Server Error';
    } else if (response.status === 501) {
      errorMessage = '501 Not Implemented';
    } else if (response.status === 502) {
      errorMessage = '502 Bad Gateway';
    } else if (response.status === 503) {
      errorMessage = '503 Service Unavailable';
    } else if (response.status === 504) {
      errorMessage = '504 Gateway Timeout';
    } else if (response.status === 505) {
      errorMessage = '505 HTTP Version Not Supported';
    } else if (response.status >= 500) {
      errorMessage = `${response.status} Server Error`;
    }
    
    // Include custom error message if available
    if (errorData?.message) {
      errorMessage = `${errorMessage}: ${errorData.message}`;
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
}

export async function fetchPlayerData(username: string) {
  return fetchWithConfig(`/player-stats/${encodeURIComponent(username)}`, {
    next: {
      revalidate: 0
    }
  });
}

export async function fetchStatPentagon(polarisId: string) {
  return fetchWithConfig(`/player-stats/getStatPentagon?polarisId=${encodeURIComponent(polarisId)}`, {
    next: {
      revalidate: 86400
    }
  });
}

export async function fetchStatistics(endpoint: string) {
  return fetchWithConfig(`/statistics/${endpoint}`);
}

export async function fetchAllGameVersions(): Promise<string[]> {
  return fetchWithConfig('/statistics/getAllGameVersions', {
    next: {
      revalidate: 300 // Cache for 5 minutes
    }
  });
}

export async function fetchVersionedStatistics(gameVersion: number) {
  return fetchWithConfig(`/statistics/versionedStatistics?gameVersion=${gameVersion}`, {
    next: {
      revalidate: 300 // Cache for 5 minutes
    }
  });
}

export async function fetchCharacterLeaderboards(characterEnum: string) {
  return fetchWithConfig(`/statistics/leaderboards?tkChar=${characterEnum}`, {
    next: {
      revalidate: 60 // Cache for 1 minute
    }
  });
}
