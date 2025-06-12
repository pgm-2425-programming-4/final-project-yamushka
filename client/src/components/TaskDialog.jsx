import React, { useState } from 'react';
import StatusSelector from './StatusSelector';
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

  // Fetch all available statuses for editing
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

      // Invalidate and refetch tasks using project documentId
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
    // Reset form values to original task values
    setTitle(task?.taskTitle || '');
    setDescription(task?.taskDescription || '');
    setStatusId(task?.taskStatus?.id || '');
    setError(null);
    setIsEditing(false);
  };

  if (!task) return null; // Direct access for API response
  const status = task.taskStatus?.statusName || 'Unknown';
  const projectName = task.project?.name || 'Unknown Project';
  return (
    <div className="task-dialog-overlay">
      <div className="task-dialog">
        <div className="task-dialog-header">
          <h3>{isEditing ? 'Edit Task' : 'Task Details'}</h3>
          <div className="header-actions">
            {!isEditing && (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Edit
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
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="Task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Task description"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                {statusesLoading ? (
                  <p>Loading statuses...</p>
                ) : statusesError ? (
                  <p>Error loading statuses</p>
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
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting || !title}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="task-detail">
                <strong>Title:</strong>
                <span>{task.taskTitle}</span>
              </div>

              <div className="task-detail">
                <strong>Description:</strong>
                <p>
                  {!task.taskDescription
                    ? 'No description'
                    : typeof task.taskDescription === 'string'
                      ? task.taskDescription
                      : Array.isArray(task.taskDescription) && task.taskDescription.length > 0
                        ? 'Complex formatted description'
                        : 'No description'}
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
                <strong>Task ID:</strong>
                <span>{task.id}</span>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <StatusSelector
            task={task}
            onStatusChange={(newStatusId, newStatusName) => {
              console.log(
                `Task ${task.id} status changed to: ${newStatusName} (ID: ${newStatusId})`
              );
            }}
          />
        )}

        {!isEditing && (
          <div className="task-dialog-footer">
            <button className="close-button-text" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
