import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

export async function createTask(taskData) {
  const projectId = parseInt(taskData.projectId);
  const statusId = taskData.statusId ? parseInt(taskData.statusId) : 2;

  if (!taskData.title || isNaN(projectId)) {
    throw new Error('Ongeldige invoer: titel of project ontbreekt');
  }

  const response = await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        taskTitle: taskData.title,
        taskDescription: taskData.description || '',
        project: projectId,
        taskStatus: statusId,
        labels: taskData.labels || [],
      },
    }),
  });

  const result = await handleApiResponse(response, 'Fout bij aanmaken van taak');
  return result.data;
}
