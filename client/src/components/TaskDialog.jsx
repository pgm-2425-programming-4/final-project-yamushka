import React from 'react';
import StatusSelector from './StatusSelector';
import '../styles/taskDialog.css';

export default function TaskDialog({ task, onClose }) {
  if (!task) return null; // Direct access for API response
  const status = task.taskStatus?.statusName || 'Unknown';
  const projectName = task.project?.name || 'Unknown Project';
  return (
    <div className="task-dialog-overlay">
      <div className="task-dialog">
        <div className="task-dialog-header">
          <h3>Task Details</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="task-dialog-content">
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
        </div>

        <StatusSelector
          task={task}
          onStatusChange={(newStatusId, newStatusName) => {
            console.log(`Task ${task.id} status changed to: ${newStatusName} (ID: ${newStatusId})`);
          }}
        />

        <div className="task-dialog-footer">
          <button className="close-button-text" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
