import { API_URL } from '../../constants/constants';

export async function fetchAllProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Fout bij ophalen van projecten');
  }

  const json = await res.json();
  return json.data;
}
