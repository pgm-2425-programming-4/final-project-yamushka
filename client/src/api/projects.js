import { API_URL, API_TOKEN } from '../constants/constants';

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Fout bij ophalen van projecten');
  }

  const json = await res.json();
  return json.data;
}

export async function fetchProjectByDocumentId(documentId) {
  const res = await fetch(`${API_URL}/projects?filters[documentId][$eq]=${documentId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Fout bij ophalen van project');
  }

  const json = await res.json();
  return json.data?.[0] || null; // Geef eerste project terug of null
}

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
