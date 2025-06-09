import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

function AddTaskForm({ projectId, onClose, statuses }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "to-do",
    priority: "Medium",
  });

  const queryClient = useQueryClient();

  const statusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "to-do", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "ready-for-review", label: "Ready for Review" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "High", label: "Hoog" },
    { value: "Medium", label: "Middel" },
    { value: "Low", label: "Laag" },
  ];

  const createMutation = useMutation({
    mutationFn: async (newTask) => {
      return axios.post(`${API_URL}/tasks`, {
        data: newTask,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      onClose();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Zoek status ID op basis van naam
    const statusId = statuses.find(
      (s) =>
        s.attributes.statusName.toLowerCase().replaceAll(" ", "-") ===
        task.status
    )?.id;

    if (!statusId) {
      alert("Status niet gevonden!");
      return;
    }

    const newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      project: projectId,
      taskStatus: statusId,
    };

    createMutation.mutate(newTask);
  };

  return (
    <div className="task-dialog-overlay" onClick={onClose}>
      <div className="task-dialog" onClick={(e) => e.stopPropagation()}>
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
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Beschrijving</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={task.status} onChange={handleChange}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Prioriteit</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="task-dialog-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? "Bezig..." : "Toevoegen"}
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

export default AddTaskForm;
