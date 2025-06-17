import { simpleFetch } from '../apiHelpers';

export async function fetchStatuses() {
  return simpleFetch('/statuses', 'Error fetching statuses');
}
