import { apiFetch } from '../apiFetch';

export async function fetchProjectByDocumentId(documentId) {
  const res = await apiFetch(`/projects?filters[documentId][$eq]=${documentId}`);

  if (!res.ok) {
    throw new Error('Fout bij ophalen van project');
  }

  const json = await res.json();
  return json.data?.[0] || null; // Geef eerste project terug of null
}
