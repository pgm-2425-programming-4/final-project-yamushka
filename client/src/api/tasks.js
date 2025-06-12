import { API_URL } from '../constants/constants';

export async function fetchTasksByProject(documentId) {
  const url = `${API_URL}/tasks?populate[]=taskStatus&populate[]=project&filters[project][documentId][$eq]=${documentId}`;

  const res = await fetch(url);
  const json = await res.json();

  return json.data || [];
}
