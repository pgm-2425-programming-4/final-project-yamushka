import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStatuses } from '../api/statuses';
import { updateTaskStatus } from '../api/updateTask';
import '../styles/statusSelector.css';

export default function StatusSelector({ task, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Get current status
  const currentStatusId = task.taskStatus?.id;
  const currentStatusName = task.taskStatus?.statusName || 'Backlog';

  // Fetch all available statuses
  const {
    data: statuses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
  });

  const handleStatusChange = async e => {
    const newStatusId = parseInt(e.target.value);

    if (newStatusId === currentStatusId) return;

    setIsUpdating(true);

    try {
      // Find the status name for debug 
      const newStatus = statuses.find(status => status.id === newStatusId);
      const newStatusName = newStatus?.statusName || 'Unknown';

      console.log(
        `Updating task ${task.documentId} status from "${currentStatusName}" to "${newStatusName}"`
      );

      // Update the status in the API
      await updateTaskStatus(task.documentId, newStatusId);

      // Invalidate and refetch tasks for the project using documentId
      const projectDocumentId = task.project?.documentId;
      if (projectDocumentId) {
        queryClient.invalidateQueries(['tasks', projectDocumentId]);
      }

      // Call the callback
      if (onStatusChange) {
        onStatusChange(newStatusId, newStatusName);
      }

      console.log(`task ${task.documentId} status updated to "${newStatusName}"`);
    } catch (err) {
      console.error('failed to update task status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="status-selector-loading">Loading...</div>;
  if (error) return <div className="status-selector-error">Failed to load statuses</div>;

  return (
    <div className="status-selector">
      <label htmlFor="status-change">Change status:</label>
      <select
        id="status-change"
        value={currentStatusId || ''}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className="status-select"
      >
        {statuses?.map(status => (
          <option key={status.id} value={status.id}>
            {status.statusName}
          </option>
        ))}
      </select>
      {isUpdating && <span className="status-updating-indicator">Updating...</span>}
    </div>
  );
}
