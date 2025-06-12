import { API_URL } from '../constants/constants';

export async function fetchTasksByProject(documentId) {

  const url = `${API_URL}/tasks?populate[]=taskStatus&populate[]=project&filters[project][documentId][$eq]=${documentId}`;

  console.log(`Fetching tasks for project documentId: ${documentId}`);

  const res = await fetch(url);
  const json = await res.json();

  console.log(`Found ${json.data?.length || 0} tasks for project ${documentId}`);

  // Log elke taak 
  if (json.data?.length > 0) {
    json.data.forEach(task => {
      console.log(
        `- Task ${task.id}: ${task.taskTitle} (Status: ${task.taskStatus?.statusName || 'No status'})`
      );
    });
  }

  return json.data || [];
}
