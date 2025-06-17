import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

export async function fetchAllProjects() {
  const response = await apiFetch('/projects');
  const json = await handleApiResponse(response, 'Fout bij ophalen van projecten');
  return json.data;
}
