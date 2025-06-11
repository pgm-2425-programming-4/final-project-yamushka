import { API_URL } from '../constants/constants';

export async function fetchTasksByProject(documentId) {
  const url = `${API_URL}/tasks?populate[]=taskStatus&populate[]=project&filters[project][id][$eq]=${documentId}`;

  const res = await fetch(url);
  const json = await res.json();

  console.log(`Found ${json.data?.length || 0} tasks for project ${documentId}`);

  return json.data || [];
}
