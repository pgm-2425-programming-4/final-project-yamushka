import { apiFetch } from '../apiFetch';

export async function fetchTasksByProject(documentId) {
  const url = `/tasks?populate[]=taskStatus&populate[]=project&populate[]=labels&filters[project][documentId][$eq]=${documentId}`;

  const res = await apiFetch(url);
  const json = await res.json();

  return json.data || [];
}
