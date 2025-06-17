import { apiFetch } from '../apiFetch';

export async function updateTask(taskDocumentId, taskData) {
  const res = await apiFetch(`/tasks/${taskDocumentId}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        ...taskData,
        labels: taskData.labels || [],
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Error updating task');
  }

  const json = await res.json();
  return json.data;
}
