import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants/constants';

/**
 * Dialog component voor het bekijken en bewerken van taakdetails
 * @param {Object} props - Component props
 * @param {Object} props.task - De taak die wordt weergegeven/bewerkt
 * @param {Function} props.onClose - Functie die wordt aangeroepen als de dialog wordt gesloten
 * @param {Array} props.statuses - Lijst met beschikbare statussen van de API
 */
function TaskDialog({ task, onClose, statuses }) {
  // Initialiseer taak met consistente veldnamen
  const [currentTask, setCurrentTask] = useState(() => {
    return {
      ...task,
      attributes: {
        ...task.attributes,
        taskTitle: task.attributes.taskTitle || task.attributes.title || '',
        taskDescription: task.attributes.taskDescription || task.attributes.description || '',
      },
    };
  });

  const queryClient = useQueryClient();

  // Status opties voor de dropdown
  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'Ready for Review' },
    { value: 'done', label: 'Done' },
  ];

  /**
   * Zoek een status ID op basis van de status waarde
   * @param {string} statusValue - De status waarde (bijv. 'todo', 'in-progress')
   * @returns {number|undefined} - Het gevonden status ID of undefined
   */
  const findStatusId = statusValue => {
    // Probeer eerst een directe match te vinden met database statussen
    if (Array.isArray(statuses) && statuses.length > 0) {
      const matchingStatus = statuses.find(
        s => s?.attributes?.statusName?.toLowerCase().replaceAll(' ', '-') === statusValue
      );

      if (matchingStatus) {
        return matchingStatus.id;
      }
    }

    // Als er geen match is, gebruik vaste IDs als fallback
    const statusMapping = {
      backlog: 1,
      todo: 2,
      'in-progress': 3,
      'in-review': 4,
      done: 5,
    };

    return statusMapping[statusValue];
  };

  // Mutation voor het bijwerken van de taak
  const updateMutation = useMutation({
    mutationFn: async updatedTask => {
      return axios.put(`${API_URL}/tasks/${task.id}`, {
        data: updatedTask,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['projectTasks']);
      onClose();
    },
    onError: error => {
      console.error('Fout bij het bijwerken van de taak:', error);
      alert('Er is een fout opgetreden bij het bijwerken van de taak. Probeer het opnieuw.');
    },
  });

  /**
   * Verwerk tekstinvoer wijzigingen
   */
  const handleChange = e => {
    const { name, value } = e.target;
    setCurrentTask(prevTask => ({
      ...prevTask,
      attributes: {
        ...prevTask.attributes,
        [name]: value,
      },
    }));
  };

  /**
   * Verwerk status dropdown wijzigingen
   */
  const handleStatusChange = e => {
    const statusValue = e.target.value;
    const statusId = findStatusId(statusValue);

    if (statusId) {
      setCurrentTask(prevTask => ({
        ...prevTask,
        attributes: {
          ...prevTask.attributes,
          taskStatus: {
            data: {
              id: statusId,
            },
          },
        },
      }));
    }
  };

  /**
   * Verwerk formulier indiening
   */
  const handleSubmit = e => {
    e.preventDefault();

    // Bereid gegevens voor om bij te werken
    const dataToUpdate = {
      taskTitle: currentTask.attributes.taskTitle,
      taskDescription: currentTask.attributes.taskDescription,
    };

    // Voeg status relatie toe indien aanwezig
    if (currentTask.attributes?.taskStatus?.data?.id) {
      dataToUpdate.taskStatus = currentTask.attributes.taskStatus.data.id;
    }

    // Stuur update naar server
    updateMutation.mutate(dataToUpdate);
  };

  // Krijg huidige status voor de dropdown
  const currentStatus =
    currentTask.attributes.taskStatus?.data?.attributes?.statusName
      ?.toLowerCase()
      .replaceAll(' ', '-') || '';

  return (
    <div className="task-dialog-overlay" onClick={onClose}>
      <div className="task-dialog" onClick={e => e.stopPropagation()}>
        <div className="task-dialog-header">
          <h2>Taak Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Titel veld */}
          <div className="form-group">
            <label>Titel</label>
            <input
              type="text"
              name="taskTitle"
              value={currentTask.attributes.taskTitle || ''}
              onChange={handleChange}
              required
            />
          </div>

          {/* Beschrijving veld */}
          <div className="form-group">
            <label>Beschrijving</label>
            <textarea
              name="taskDescription"
              value={currentTask.attributes.taskDescription || ''}
              onChange={handleChange}
              rows={5}
            />
          </div>

          {/* Status dropdown */}
          <div className="form-group">
            <label>Status</label>
            <select value={currentStatus} onChange={handleStatusChange}>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Labels (tags) sectie */}
          <div className="form-group">
            <label>Labels</label>
            <div className="task-tags">
              {currentTask.attributes.tags?.data?.map(tag => (
                <span key={tag.id} className={`task-tag ${tag.attributes.name.toLowerCase()}`}>
                  <span className="tag-dot"></span>
                  {tag.attributes.name}
                </span>
              ))}
            </div>
          </div>

          {/* Actieknoppen */}
          <div className="task-dialog-actions">
            <button type="submit" className="btn btn-primary" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? 'Opslaan...' : 'Opslaan'}
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

export default TaskDialog;
