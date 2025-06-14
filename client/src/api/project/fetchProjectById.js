import { API_URL } from '../../constants/constants';

export async function fetchProjectByDocumentId(documentId) {
  const res = await fetch(`${API_URL}/projects?filters[documentId][$eq]=${documentId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Fout bij ophalen van project');
  }

  const json = await res.json();
  return json.data?.[0] || null; // Geef eerste project terug of null
}
