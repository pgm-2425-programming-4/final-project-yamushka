import { apiFetch } from '../apiFetch';

export async function createProject(projectData) {
  const res = await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({
      data: projectData,
    }),
  });

  if (!res.ok) {
    throw new Error('Fout bij aanmaken van project');
  }

  const json = await res.json();
  return json.data;
}
