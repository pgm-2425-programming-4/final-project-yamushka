import { API_URL } from '../constants/constants';

export async function fetchTasksByProject(documentId) {
  const res = await fetch(
    `${API_URL}/tasks?populate=*&filters[project][documentId][$eq]=${documentId}`
  );
  const json = await res.json();
  return json.data; 
}
