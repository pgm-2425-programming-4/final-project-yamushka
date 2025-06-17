import { useState } from 'react';
import { createTask } from '../api/task/createTask';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '../api/status/fetchStatuses';
import { fetchLabels } from '../api/label/fetchLabels';

export default function TaskForm({ projectId, projectDocumentId, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState('2'); // Standaard naar backlog (ID: 2)
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  // Haal alle beschikbare statussen op
  const {
    data: statuses,
    isLoading: statusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
  });

  // Haal alle beschikbare labels op
  const {
    data: labels,
    isLoading: labelsLoading,
    error: labelsError,
  } = useQuery({
    queryKey: ['labels'],
    queryFn: fetchLabels,
  });

  const handleLabelToggle = labelId => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createTask({
        title,
        description,
        projectId,
        statusId: parseInt(statusId),
        labels: selectedLabels, // Voeg geselecteerde labels toe
      });

      // Maak het formulier leeg
      setTitle('');
      setDescription('');
      setStatusId('2'); // Terug naar standaard (Backlog)
      setSelectedLabels([]); // Leeg de geselecteerde labels

      // Vernieuw taken met documentId voor consistentie
      if (projectDocumentId) {
        queryClient.invalidateQueries(['tasks', projectDocumentId]);
      }
      queryClient.invalidateQueries(['tasks', String(projectId)]);

      // Roep success callback aan
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error creating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>Nieuwe Taak Toevoegen</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Taak titel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Beschrijving</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Taak beschrijving"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          {statusesLoading ? (
            <p>Statussen laden...</p>
          ) : statusesError ? (
            <p>Fout bij laden statussen</p>
          ) : (
            <div className="status-buttons">
              {statuses?.map(status => (
                <button
                  key={status.id}
                  type="button"
                  className={`status-btn ${statusId === status.id.toString() ? 'active' : ''}`}
                  onClick={() => setStatusId(status.id.toString())}
                >
                  {status.statusName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Labels</label>
          {labelsLoading ? (
            <p>Labels laden...</p>
          ) : labelsError ? (
            <p>Fout bij laden labels</p>
          ) : (
            <div className="label-buttons">
              {labels?.map(label => (
                <button
                  key={label.id}
                  type="button"
                  className={`label-btn ${selectedLabels.includes(label.id) ? 'active' : ''}`}
                  onClick={() => handleLabelToggle(label.id)}
                  style={{
                    backgroundColor: selectedLabels.includes(label.id)
                      ? label.color
                      : 'transparent',
                  }}
                >
                  {label.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Annuleren
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting || !title}>
            {isSubmitting ? 'Opslaan...' : 'Taak Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
