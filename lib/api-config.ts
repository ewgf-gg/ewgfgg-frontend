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
    throw new Error(errorData?.message || `API error: ${response.status}`);
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

export async function fetchStatistics(endpoint: string) {
  return fetchWithConfig(`/statistics/${endpoint}`);
}
