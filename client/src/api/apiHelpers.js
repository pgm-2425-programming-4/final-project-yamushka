import { apiFetch } from './apiFetch';

// Gemeenschappelijke error handler voor API calls
export const handleApiResponse = async (response, errorMessage = 'Er is een fout opgetreden') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorMessage);
  }
  return response.json();
};

// Vereenvoudigde fetch functie
export const simpleFetch = async (endpoint, errorMessage) => {
  const response = await apiFetch(endpoint);
  const json = await handleApiResponse(response, errorMessage);
  return json.data;
};
