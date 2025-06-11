import { API_URL } from '../constants/constants';

export async function fetchProjectWithTasks(projectId) {
  // First fetch the project details
  const projectRes = await fetch(`${API_URL}/projects/${projectId}?populate=*`);

  if (!projectRes.ok) {
    throw new Error('Error fetching project');
  }

  const projectData = await projectRes.json();

  // Then fetch all tasks for this project
  const tasksRes = await fetch(
    `${API_URL}/tasks?populate=*&filters[project][id][$eq]=${projectId}`
  );

  if (!tasksRes.ok) {
    throw new Error('Error fetching tasks');
  }

  const tasksData = await tasksRes.json();

  // Return combined data
  return {
    project: projectData.data,
    tasks: tasksData.data,
  };
}
