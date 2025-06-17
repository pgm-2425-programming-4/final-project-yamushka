import { apiFetch } from '../apiFetch';

export async function fetchAllProjects() {
  const res = await apiFetch('/projects');

  if (!res.ok) {
    throw new Error('Fout bij ophalen van projecten');
  }

  const json = await res.json();
  return json.data;
}
