import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../api/project/createProject';

// styles
import '../styles/main.css';

export default function ProjectForm({ onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess && onSuccess(data);
    },
    onError: error => {
      setError(error.message);
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
      description: description.trim() || null,
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

        <div className="form-group">
          <label htmlFor="project-description">Beschrijving</label>
          <textarea
            id="project-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Beschrijf je project (optioneel)..."
            disabled={mutation.isPending}
            rows={4}
          />
          <p className="form-help">Geef een korte beschrijving...</p>
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
