import { apiFetch } from '../apiFetch';

export async function deleteProject(documentId) {
  const response = await apiFetch(`/projects/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Fout bij verwijderen van project');
  }

  return response.status === 204 ? { success: true } : await response.json();
}
