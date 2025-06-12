import { useState } from 'react';
import { createTask } from '../api/createTask';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '../api/statuses';
import '../styles/taskForm.css';

export default function TaskForm({ projectId, projectDocumentId, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState('2'); // Default to backlog (ID: 2)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  // Fetch all available statuses
  const {
    data: statuses,
    isLoading: statusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
  });
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newTask = await createTask({
        title,
        description,
        projectId,
        statusId: parseInt(statusId),
      });

      console.log('Task created successfully:', newTask.id);

      // Clear the form
      setTitle('');
      setDescription('');
      setStatusId('2'); // Reset to default (Backlog)

      // Invalidate and refetch tasks using documentId for consistency
      if (projectDocumentId) {
        queryClient.invalidateQueries(['tasks', projectDocumentId]);
      }
      queryClient.invalidateQueries(['tasks', String(projectId)]);

      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Error creating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3>Add New Task</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Task title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Task description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          {statusesLoading ? (
            <p>Loading statuses...</p>
          ) : statusesError ? (
            <p>Error loading statuses</p>
          ) : (
            <select
              id="status"
              value={statusId}
              onChange={e => setStatusId(e.target.value)}
              className="status-select"
            >
              {statuses?.map(status => (
                <option key={status.id} value={status.id}>
                  {status.statusName}
                </option>
              ))}
            </select>
          )}
          <p className="form-help">Default is Backlog</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting || !title}>
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
