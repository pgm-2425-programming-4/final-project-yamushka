// filepath: /Users/jj/final-project-yamushka/client/src/components/AddTaskForm.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants/constants';

function AddTaskForm({ projectId, projectDocumentId, onClose, statuses }) {
  const [task, setTask] = useState({
    taskTitle: '',
    taskDescription: '',
    status: 'Backlog', // Standaard status
  });

  const queryClient = useQueryClient();

  // Beschikbare status opties voor de dropdown
  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'Todo', label: 'To Do' },
    { value: 'In progress', label: 'In Progress' },
    { value: 'In review', label: 'Ready for Review' },
    { value: 'Done', label: 'Done' },
  ];

  // aanmaken van een nieuwe taak
  const createMutation = useMutation({
    mutationFn: async newTask => {
      try {
        return await axios.post(`${API_URL}/tasks`, {
          data: newTask,
        });
      } catch (error) {
        console.error('API fout:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Update de UI query cache om de nieuwe taak te tonen
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['projectTasks', projectDocumentId || projectId]);
      onClose();
    },
    onError: error => {
      console.error('Fout bij maken taak:', error);
      const errorMessage =
        error.response?.data?.error?.message || 'Er is iets misgegaan. Probeer opnieuw.';
      alert(`Fout: ${errorMessage}`);
    },
  });

  /**
   *  input veld wijzigingen
   */
  const handleChange = e => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  /* formulier verzending */
  const handleSubmit = e => {
    e.preventDefault();

    // Vind de juiste status ID
    let statusId = vindStatusId(task.status, statuses);

    if (!projectId) {
      alert('Er is geen project geselecteerd. Probeer opnieuw.');
      return;
    }

    const taskTitle = task.taskTitle.trim();
    if (!taskTitle) {
      alert('Titel is verplicht. Vul een titel in.');
      return;
    }

    const newTask = {
      taskTitle: taskTitle,
      taskDescription: task.taskDescription || '',
      taskStatus: statusId,
      project: projectId,
    };

    createMutation.mutate(newTask);
  };

  function vindStatusId(statusName, statuses) {

    if (Array.isArray(statuses) && statuses.length > 0) {
      const matchingStatus = statuses.find(status => {
        if (!status?.attributes?.statusName) return false;
        return status.attributes.statusName.toLowerCase() === statusName.toLowerCase();
      });

      if (matchingStatus) {
        return matchingStatus.id;
      }
    }

    const statusMapping = {
      Backlog: 1,
      Todo: 2,
      'In progress': 3,
      'In review': 4,
      Done: 5,
    };

    return statusMapping[statusName] || 1; 
  }

  return (
    <div className="task-dialog-overlay" onClick={onClose}>
      <div className="task-dialog" onClick={e => e.stopPropagation()}>
        <div className="task-dialog-header">
          <h2>Nieuwe taak toevoegen</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titel</label>
            <input
              type="text"
              name="taskTitle"
              value={task.taskTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Beschrijving</label>
            <textarea
              name="taskDescription"
              value={task.taskDescription}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={task.status} onChange={handleChange}>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="task-dialog-actions">
            <button type="submit" className="btn btn-primary" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'Bezig...' : 'Toevoegen'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskForm;
