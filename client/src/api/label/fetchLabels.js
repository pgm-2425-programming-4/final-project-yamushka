import { simpleFetch } from '../apiHelpers';

export async function fetchLabels() {
  return simpleFetch('/labels', 'Fout bij ophalen van labels');
}
