import { API_URL } from '../../constants/constants';

export async function createProject(projectData) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
