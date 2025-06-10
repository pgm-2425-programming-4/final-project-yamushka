import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

function AddTaskForm({ projectId, onClose, statuses }) {
  // Basis taak state met standaardwaarden
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Backlog", // Standaard status
    priority: "Medium",
  });

  const queryClient = useQueryClient();

  const statusOptions = [
    { value: "Backlog", label: "Backlog" },
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Ready for Review", label: "Ready for Review" },
    { value: "Done", label: "Done" },
  ];

  // mss niet nodig, ik zie later 
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
    onError: (error) => {
      console.error("Fout bij aanmaken taak:", error);
      alert("Er is iets misgegaan. Probeer opnieuw.");
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

    // Stap 1: Zoek de juiste status ID
    let statusId;

    // Controleer of ik al statuses heb en zo ja, zoek de juiste status
    if (Array.isArray(statuses) && statuses.length > 0) {
      // Eerst zoeken op exacte match (hoofdletter of niet)
      const matchingStatus = statuses.find((status) => {
        if (!status?.attributes?.statusName) return false;
        return (
          status.attributes.statusName.toLowerCase() ===
          task.status.toLowerCase()
        );
      });

      if (matchingStatus) {
        statusId = matchingStatus.id;
      }
    }

    // geen match??? vaste ID's als fallback
    if (!statusId) {
      // vaste ID's als backup
      const statusMapping = {
        Backlog: 1,
        "To Do": 2,
        "In Progress": 3,
        "Ready for Review": 4,
        Done: 5,
      };

      statusId = statusMapping[task.status];
    }

    // og steeds geen ID gevonden, gebruik Backlog (ID 1)
    if (!statusId) {
      statusId = 1; // Default naar Backlog
    }

    // Stap 2: een nieuw taak object
    const newTask = {
      title: task.title || "Untitled Task", 
      description: task.description || "",
      priority: task.priority || "Medium",
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
