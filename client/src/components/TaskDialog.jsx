import React, { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '../api/statuses';
import { updateTask } from '../api/updateTask';
import '../styles/taskDialog.css';

export default function TaskDialog({ task, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.taskTitle || '');
  const [description, setDescription] = useState(task?.taskDescription || '');
  const [statusId, setStatusId] = useState(task?.taskStatus?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  // Haal alle beschikbare statussen op voor het bewerken
  const {
    data: statuses,
    isLoading: statusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
  });

  const handleEditSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedTask = await updateTask(task.documentId, {
        taskTitle: title,
        taskDescription: description,
        taskStatus: parseInt(statusId),
      });

      console.log('Task updated successfully:', updatedTask.id);

      // Vernieuw de takenlijst met het project documentId
      const projectDocumentId = task.project?.documentId;
      if (projectDocumentId) {
        queryClient.invalidateQueries(['tasks', projectDocumentId]);
      }

      setIsEditing(false);
    } catch (err) {
      console.error('error updating task:', err);
      setError(err.message || 'Error updating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    // Zet formulier waarden terug naar originele taak waarden
    setTitle(task?.taskTitle || '');
    setDescription(task?.taskDescription || '');
    setStatusId(task?.taskStatus?.id || '');
    setError(null);
    setIsEditing(false);
  };

  if (!task) return null; // Directe toegang voor API response
  const status = task.taskStatus?.statusName || 'Onbekend';
  const projectName = task.project?.name || 'Onbekend Project';
  return (
    <div className="task-dialog-overlay">
      <div className="task-dialog">
        <div className="task-dialog-header">
          <h3>{isEditing ? 'Taak Bewerken' : 'Taak Details'}</h3>
          <div className="header-actions">
            {!isEditing && (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Bewerken
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="task-dialog-content">
          {error && <div className="error-message">{error}</div>}

          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="edit-title">Titel</label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="Taak titel"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Beschrijving</label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Taak beschrijving"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                {statusesLoading ? (
                  <p>Statussen laden...</p>
                ) : statusesError ? (
                  <p>Fout bij laden statussen</p>
                ) : (
                  <select
                    id="edit-status"
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
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-button"
                  disabled={isSubmitting}
                >
                  Annuleren
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting || !title}>
                  {isSubmitting ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="task-detail">
                <strong>Titel:</strong>
                <span>{task.taskTitle}</span>
              </div>

              <div className="task-detail">
                <strong>Beschrijving:</strong>
                <p>
                  {!task.taskDescription
                    ? 'Geen beschrijving'
                    : typeof task.taskDescription === 'string'
                      ? task.taskDescription
                      : Array.isArray(task.taskDescription) && task.taskDescription.length > 0
                        ? 'Complexe geformatteerde beschrijving'
                        : 'Geen beschrijving'}
                </p>
              </div>

              <div className="task-detail">
                <strong>Status:</strong>
                <span className="status-badge">{status}</span>
              </div>

              <div className="task-detail">
                <strong>Project:</strong>
                <span>{projectName}</span>
              </div>

              <div className="task-detail">
                <strong>Taak ID:</strong>
                <span>{task.id}</span>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="task-dialog-footer">
            <button className="close-button-text" onClick={onClose}>
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
