import { API_URL } from '../../constants/constants';

export async function fetchLabels() {
  const res = await fetch(`${API_URL}/labels`);

  if (!res.ok) {
    throw new Error('Fout bij ophalen van labels');
  }

  const data = await res.json();
  return data.data;
}
