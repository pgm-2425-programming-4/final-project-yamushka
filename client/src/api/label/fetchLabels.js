import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

export async function fetchLabels() {
  const response = await apiFetch('/labels');
  const json = await handleApiResponse(response, 'Fout bij ophalen van labels');
  return json.data;
}
