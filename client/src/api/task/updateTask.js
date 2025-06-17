import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

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

  const json = await handleApiResponse(res, 'Error updating task');
  return json.data;
}
