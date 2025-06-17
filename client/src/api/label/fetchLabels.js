import { apiFetch } from '../apiFetch';

export async function fetchLabels() {
  const res = await apiFetch('/labels');

  if (!res.ok) {
    throw new Error('Fout bij ophalen van labels');
  }

  const data = await res.json();
  return data.data;
}
