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
      // Find the status name for debugging
      const newStatus = statuses.find(status => status.id === newStatusId);
      const newStatusName = newStatus?.statusName || 'Unknown';

      console.log(
        `🔄 Updating task ${task.id} status from "${currentStatusName}" to "${newStatusName}"`
      );

      // Update the status in the API
      await updateTaskStatus(task.id, newStatusId);

      // Invalidate and refetch tasks for the project
      const projectId = task.project?.id;
      if (projectId) {
        queryClient.invalidateQueries(['tasks', String(projectId)]);
      }

      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(newStatusId, newStatusName);
      }

      console.log(`✅ Task ${task.id} status updated to "${newStatusName}"`);
    } catch (err) {
      console.error('❌ Failed to update task status:', err);
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
