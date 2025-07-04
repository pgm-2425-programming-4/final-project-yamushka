import { useState } from 'react';
import { createTask } from '../api/task/createTask';
import { useQueryClient } from '@tanstack/react-query';
import { useFormData, useLabelToggle } from '../hooks/useFormData';
import { FormSection } from './shared/FormSection';
import { showToast } from './shared/Toast';

export default function TaskForm({ projectId, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Verwijder error state - we gebruiken alleen toasts

  const queryClient = useQueryClient();
  const { statuses, statusesLoading, statusesError, labels, labelsLoading, labelsError } =
    useFormData();
  const { selectedLabels, setSelectedLabels, handleLabelToggle } = useLabelToggle();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTask({
        title,
        description,
        projectId,
        statusId: parseInt(statusId),
        labels: selectedLabels,
      });

      setTitle('');
      setDescription('');
      setStatusId('2');
      setSelectedLabels([]);

      // Simpeler - vernieuw alle tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      showToast('Taak succesvol aangemaakt', 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(`Fout bij aanmaken taak: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>Nieuwe Taak Toevoegen</h3>

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

        <FormSection
          label="Status"
          isLoading={statusesLoading}
          error={statusesError}
          loadingText="Statussen laden..."
          errorText="Fout bij laden statussen"
        >
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
        </FormSection>

        <FormSection
          label="Labels"
          isLoading={labelsLoading}
          error={labelsError}
          loadingText="Labels laden..."
          errorText="Fout bij laden labels"
        >
          <div className="label-buttons">
            {labels?.map(label => (
              <button
                key={label.id}
                type="button"
                className={`label-btn ${selectedLabels.includes(label.id) ? 'active' : ''}`}
                onClick={() => handleLabelToggle(label.id)}
                style={{
                  backgroundColor: selectedLabels.includes(label.id) ? label.color : 'transparent',
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </FormSection>

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
