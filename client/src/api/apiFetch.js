import { API_URL, API_TOKEN } from '../constants/constants';

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.PROD ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...options.headers,
    },
  };

  return fetch(url, config);
}
