import { API_URL } from '../constants/constants';

export async function fetchProjectWithTasks(projectId) {
  // Haal eerst de project details op
  const projectRes = await fetch(`${API_URL}/projects/${projectId}?populate=*`);

  if (!projectRes.ok) {
    throw new Error('Error fetching project');
  }

  const projectData = await projectRes.json();

  // Haal daarna alle taken voor dit project op
  const tasksRes = await fetch(
    `${API_URL}/tasks?populate=*&filters[project][id][$eq]=${projectId}`
  );

  if (!tasksRes.ok) {
    throw new Error('Error fetching tasks');
  }

  const tasksData = await tasksRes.json();

  // Geef gecombineerde data terug
  return {
    project: projectData.data,
    tasks: tasksData.data,
  };
}
