import { simpleFetch } from '../apiHelpers';

export async function fetchAllProjects() {
  return simpleFetch('/projects', 'Fout bij ophalen van projecten');
}
