import { API_URL } from '../../constants/constants';

export async function updateTask(taskDocumentId, taskData) {
  const res = await fetch(`${API_URL}/tasks/${taskDocumentId}`, {
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
