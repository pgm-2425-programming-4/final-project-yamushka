import { API_URL } from '../constants/constants';

export async function updateTask(taskDocumentId, taskData) {
  console.log(`API call: Updating task ${taskDocumentId} with data:`, taskData);

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
    console.error('API error response:', errorData);
    throw new Error(errorData.error?.message || 'Error updating task');
  }

  const json = await res.json();
  console.log('API success response:', json);
  return json.data;
}
