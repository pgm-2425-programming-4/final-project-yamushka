import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

function TaskDialog({ task, onClose, statuses }) {
  const [currentTask, setCurrentTask] = useState(task);
  const queryClient = useQueryClient();

  const statusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "to-do", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "ready-for-review", label: "Ready for Review" },
    { value: "done", label: "Done" },
  ];

  // Status opties voor de dropdown
  // waarden overeen met statusnamen in Strapi

  const updateMutation = useMutation({
    mutationFn: async (updatedTask) => {
      return axios.put(`${API_URL}/tasks/${task.id}`, {
        data: updatedTask,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      onClose();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({
      ...currentTask,
      attributes: {
        ...currentTask.attributes,
        [name]: value,
      },
    });
  };

  const handleStatusChange = (e) => {
    const statusValue = e.target.value;

    // Stap 1: statusId op basis van de geselecteerde waarde
    let statusId;

    // eerst een directe match met database statussen
    if (Array.isArray(statuses) && statuses.length > 0) {
      const matchingStatus = statuses.find(
        (s) =>
          s?.attributes?.statusName?.toLowerCase().replaceAll(" ", "-") ===
          statusValue
      );

      if (matchingStatus) {
        statusId = matchingStatus.id;
      }
    }

    // geen match?????? gebruik vaste ID's als fallback
    if (!statusId) {
      const statusMapping = {
        backlog: 1,
        "to-do": 2,
        "in-progress": 3,
        "ready-for-review": 4,
        done: 5,
      };
      statusId = statusMapping[statusValue];
    }

    // Stap 2: update taak met de nieuwe status
    if (statusId) {
      setCurrentTask({
        ...currentTask,
        attributes: {
          ...currentTask.attributes,
          taskStatus: {
            data: {
              id: statusId,
            },
          },
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // verzamel de gewijzigde data voor update
    const dataToUpdate = {
      title: currentTask.attributes.title,
      description: currentTask.attributes.description,
      taskStatus: currentTask.attributes.taskStatus.data.id,
    };

    // update naar de server
    updateMutation.mutate(dataToUpdate);
  };

  //  huidige status voor de dropdown
  //  spaties om naar koppeltekens en alles naar kleine letters
  const currentStatus =
    currentTask.attributes.taskStatus?.data?.attributes?.statusName
      ?.toLowerCase()
      .replaceAll(" ", "-") || "";

  return (
    <div className="task-dialog-overlay" onClick={onClose}>
      <div className="task-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="task-dialog-header">
          <h2>Taak details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titel</label>
            <input
              type="text"
              name="title"
              value={currentTask.attributes.title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Beschrijving</label>
            <textarea
              name="description"
              value={currentTask.attributes.description || ""}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={currentStatus} onChange={handleStatusChange}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Labels</label>
            <div className="task-tags">
              {currentTask.attributes.tags?.data?.map((tag) => (
                <span
                  key={tag.id}
                  className={`task-tag ${tag.attributes.name.toLowerCase()}`}
                >
                  <span className="tag-dot"></span>
                  {tag.attributes.name}
                </span>
              ))}
            </div>
          </div>

          <div className="task-dialog-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? "Bezig..." : "Opslaan"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskDialog;
