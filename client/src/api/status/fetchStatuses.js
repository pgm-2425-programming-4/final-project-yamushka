import { API_URL } from '../../constants/constants';

export async function fetchStatuses() {
  const res = await fetch(`${API_URL}/statuses`);

  if (!res.ok) {
    throw new Error('Error fetching statuses');
  }

  const json = await res.json();
  return json.data;
}
