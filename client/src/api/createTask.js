import { API_URL } from '../constants/constants';

export async function createTask(taskData) {
  const projectId = parseInt(taskData.projectId);
  const statusId = taskData.statusId ? parseInt(taskData.statusId) : 2;

  console.log('Creating task with:', { projectId, statusId });

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          taskTitle: taskData.title,
          taskDescription: taskData.description,
          project: projectId,
          taskStatus: statusId,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response from API:', errorData);
      throw new Error(errorData.error?.message || 'Error creating task');
    }

    const json = await res.json();
    console.log('Successfully created task:', json);
    return json.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}
