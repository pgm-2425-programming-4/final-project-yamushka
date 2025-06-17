import { apiFetch } from '../apiFetch';
import { handleApiResponse } from '../apiHelpers';

export async function createProject(projectData) {
  const res = await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ data: projectData }),
  });

  const json = await handleApiResponse(res, 'Fout bij aanmaken van project');
  return json.data;
}
