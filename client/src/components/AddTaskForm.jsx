import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

function AddTaskForm({ projectId, projectDocumentId, onClose, statuses }) {
// strapi veldnamen
  const [task, setTask] = useState({
    taskTitle: "",
    taskDescription: "",
    status: "Backlog", // Standaard status
  });

  const queryClient = useQueryClient();

  const statusOptions = [
    { value: "Backlog", label: "Backlog" },
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Ready for Review", label: "Ready for Review" },
    { value: "Done", label: "Done" },
  ];

  const createMutation = useMutation({
    mutationFn: async (newTask) => {
      console.log("API aanroep naar:", `${API_URL}/tasks`);
      console.log("Data die we sturen:", { data: newTask });

      try {
        const response = await axios.post(`${API_URL}/tasks`, {
          data: newTask,
        });
        console.log("Succesvol aangemaakt:", response.data);
        return response;
      } catch (error) {
        console.error("API fout:", error);
  
        throw error;
      }
    },
    onSuccess: async (response) => {
      console.log("Taak succesvol aangemaakt:", response.data);

      // validatie dat de taak succesvol is gekoppeld
      const newTask = response.data.data;
      console.log("Nieuwe taak aangemaakt met ID:", newTask.id);

      // relatie is automatisch gemaakt in Strapi


      // Update de UI query cache
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries([
        "projectTasks",
        projectDocumentId || projectId,
      ]);
      onClose();
    },
    onError: (error) => {
      console.error("Fout bij aanmaken taak:", error);
      console.error(
        "Error details:",
        error.response?.data || "Geen details beschikbaar"
      );
      const errorMessage =
        error.response?.data?.error?.message ||
        "Er is iets misgegaan. Probeer opnieuw.";
      alert(`Fout: ${errorMessage}`);
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

    // Stap 1: juiste status ID
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

    // Controleren of we een geldig projectId hebben
    if (!projectId) {
      console.error("Fout: Geen projectId beschikbaar");
      console.log("ProjectId:", projectId);
      console.log("ProjectDocumentId:", projectDocumentId);
      alert("Er is geen project geselecteerd. Probeer opnieuw.");
      return;
    }

    // Stap 2: een nieuw taak object aangepast om overeen te komen met Strapi schema
    // Zorg ervoor dat we altijd een titel hebben
    const taskTitle = task.taskTitle.trim();
    if (!taskTitle) {
      alert("Titel is verplicht. Vul een titel in.");
      return;
    }

    // In Strapi V4, relations need to be formatted with connect syntax
    const newTask = {
      taskTitle: taskTitle,
      taskDescription: task.taskDescription || "",
      // Nu kunnen we zowel taskStatus als project relaties instellen
      taskStatus: {
        connect: [{ id: statusId }],
      },
      project: {
        connect: [{ id: projectId }],
      },
    };

    // Log what we're trying to create
    console.log("Nieuw taak object:", newTask);

    console.log("Taak aan het aanmaken:", newTask);
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
              {statusOptions.map((option) => (
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
