import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

export async function fetchStatuses() {
  const response = await apiFetch('/statuses');
  const json = await handleApiResponse(response, 'Error fetching statuses');
  return json.data;
}
