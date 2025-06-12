import { API_URL } from '../../constants/constants';

export async function createTask(taskData) {
  const projectId = parseInt(taskData.projectId);
  const statusId = taskData.statusId ? parseInt(taskData.statusId) : 2;

  // Prosta walidacja wejścia
  if (!taskData.title || isNaN(projectId)) {
    throw new Error('Ongeldige invoer: titel of project ontbreekt');
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          taskTitle: taskData.title,
          taskDescription: taskData.description || '',
          project: projectId,
          taskStatus: statusId,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Fout bij aanmaken van taak');
    }

    const result = await response.json();
    return result.data;
  } catch {
    throw new Error('Er ging iets mis bij het aanmaken van de taak.');
  }
}
