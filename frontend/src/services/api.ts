/**
 * KrishiNetra Frontend API Service
 * Connects the React Frontend to the FastAPI Downscaling Backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const API_SECRET = import.meta.env.VITE_API_SECRET || '';

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get or refresh JWT Bearer Token using client API Key & Secret
 */
export async function getAuthToken(): Promise<string | null> {
  if (!API_KEY || !API_SECRET) {
    return null;
  }

  // Return cached token if valid
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: API_KEY, secret: API_SECRET }),
    });

    if (!res.ok) {
      console.warn('Failed to obtain JWT token, proceeding in public mode');
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedToken;
  } catch (err) {
    console.warn('Backend auth endpoint unreachable:', err);
    return null;
  }
}

/**
 * Helper to make authorized HTTP requests to KrishiNetra Backend
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API Request failed with status ${response.status}`);
    }
    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.warn(`[KrishiNetra API] Fallback active for ${endpoint}:`, error);
    return null;
  }
}

// === Core API Functions ===

export async function fetchPanchayatForecast(panchayatId: string, days: number = 3) {
  return apiRequest(`/forecast/${panchayatId}?days=${days}&include_uncertainty=true&include_block=true`);
}

export async function fetchPanchayatAdvisory(panchayatId: string, crop: string = 'Rice', language: string = 'en') {
  return apiRequest(`/advisory/${panchayatId}?crop=${encodeURIComponent(crop)}&language=${language}`);
}

export async function fetchBlockComparison(blockId: string, parameter: string = 'temp_max') {
  return apiRequest(`/compare/${blockId}?parameter=${parameter}`);
}

export async function fetchWeatherStations() {
  return apiRequest('/stations');
}

export async function fetchStationReadings(stationId: string, hours: number = 24) {
  return apiRequest(`/stations/${stationId}/readings?hours=${hours}`);
}

export async function searchPanchayats(query: string) {
  return apiRequest(`/search/panchayat?q=${encodeURIComponent(query)}`);
}

export async function sendSMSDelivery(phoneNumber: string, message: string) {
  return apiRequest('/delivery/sms', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phoneNumber, message }),
  });
}

export async function sendWhatsAppDelivery(phoneNumber: string, header: string, body: string) {
  return apiRequest('/delivery/whatsapp', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phoneNumber, header, body }),
  });
}

export async function submitObservationFeedback(payload: {
  panchayat_id: string;
  date: string;
  parameter: string;
  forecast_value: number;
  actual_value: number;
  reporter?: string;
  notes?: string;
}) {
  return apiRequest('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchSystemHealth() {
  return apiRequest('/health');
}
