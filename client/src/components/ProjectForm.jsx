import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../api/project/createProject';
import { showToast } from './shared/Toast';

export default function ProjectForm({ onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast('Project succesvol aangemaakt', 'success');
      onSuccess && onSuccess(data);
    },
    onError: error => {
      setError(error.message);
      showToast(`Fout bij aanmaken: ${error.message}`, 'error');
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Naam is verplicht');
      return;
    }

    mutation.mutate({
      name: name.trim(),
    });
  };

  return (
    <div className="task-form-container">
      <h3>Nieuw project aanmaken</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-name">Naam *</label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Naam voor je nieuwe project..."
            disabled={mutation.isPending}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Annuleren
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={mutation.isPending || !name.trim()}
          >
            {mutation.isPending ? 'Creëren...' : 'Aanmaken'}
          </button>
        </div>
      </form>
    </div>
  );
}
