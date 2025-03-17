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
    'Cache-Control': 'no-store',
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
  
  const response = await fetch(`${config.baseURL}${endpoint}`, {
    ...options,
    headers: {
      ...config.headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Utility function for player-specific endpoints
export async function fetchPlayerData(username: string) {
    return fetchWithConfig(`/player-stats/${encodeURIComponent(username)}`);
  }
  
  // Utility function for statistics endpoints
  export async function fetchStatistics(endpoint: string) {
    return fetchWithConfig(`/statistics/${endpoint}`);
  }
