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
    const statusId = statuses.find(
      (s) =>
        s.attributes.statusName.toLowerCase().replaceAll(" ", "-") ===
        statusValue
    )?.id;

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
    const dataToUpdate = {
      title: currentTask.attributes.title,
      description: currentTask.attributes.description,
      taskStatus: currentTask.attributes.taskStatus.data.id,
    };

    updateMutation.mutate(dataToUpdate);
  };

  // Bepaal huidige status
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
