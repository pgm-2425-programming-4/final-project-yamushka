import { API_URL } from '../../constants/constants';

export async function createLabel(labelData) {
  const res = await fetch(`${API_URL}/labels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        name: labelData.name,
        color: labelData.color || '#3498db',
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Fout bij aanmaken van label');
  }

  const result = await res.json();
  return result.data;
}
