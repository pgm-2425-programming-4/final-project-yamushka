import { API_URL, API_TOKEN } from '../constants/constants';

export async function fetchProjects() {
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
  
