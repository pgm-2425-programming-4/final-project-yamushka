import { apiFetch } from '../apiFetch';

export async function fetchStatuses() {
  const res = await apiFetch('/statuses');

  if (!res.ok) {
    throw new Error('Error fetching statuses');
  }

  const json = await res.json();
  return json.data;
}
