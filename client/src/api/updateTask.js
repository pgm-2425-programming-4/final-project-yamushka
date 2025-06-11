import { API_URL } from '../constants/constants';

export async function updateTaskStatus(taskId, statusId) {
  console.log(`API call: Updating task ${taskId} with status ${statusId}`);

  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        taskStatus: statusId,
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('API error response:', errorData);
    throw new Error(errorData.error?.message || 'Error updating task');
  }

  const json = await res.json();
  console.log('API success response:', json);
  return json.data;
}

export async function updateTask(taskId, taskData) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: taskData,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Error updating task');
  }

  const json = await res.json();
  return json.data;
}
