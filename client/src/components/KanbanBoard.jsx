import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";
import TaskDialog from "./TaskDialog";
import AddTaskForm from "./AddTaskForm";

function KanbanBoard() {
  // URL parameter voor het project ID
  const { projectId } = useParams();
  
  // State voor UI interactie
  const [showAddTask, setShowAddTask] = useState(false);  // Toont het "Taak toevoegen" dialoog
  const [selectedTask, setSelectedTask] = useState(null); // Geselecteerde taak voor bewerken
  
  // Filter instellingen voor zoeken en filteren
  const [filters, setFilters] = useState({
    search: "",     // Zoektekst voor taken
    status: "all",  // Filter op status (all, to-do, in-progress, etc.)
    priority: "all", // Filter op prioriteit (all, High, Medium, Low)
  });

  // Haal statussen op van de server
  const {
    data: statusData,
  } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/statuses`);
        return res.data.data; // Alleen de data array teruggeven
      } catch (error) {
        console.error("Error bij ophalen statussen:", error);
        return []; // Lege array bij fouten
      }
    },
  });


  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/projects?filters[documentId][$eq]=${projectId}`
      );
      return res.data;
    },
    enabled: !!projectId,
  });

  const actualProject = projectData?.data?.[0];
  const actualProjectId = actualProject?.id;


  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/projects?filters[documentId][$eq]=${projectId}&populate[tasks][populate]=taskStatus`
      );

      const project = res.data.data?.[0];
      console.log("Project met taken en statusen:", project);

      return {
        data: project?.attributes?.tasks?.data || [],
      };
    },
    enabled: !!projectId,
  });

  // Filter taken op basis van zoekopdracht, status en prioriteit
  const filterTasks = (tasks) => {
    // Als er geen taken zijn, geef lege array terug
    if (!tasks) return [];

    return tasks.filter((task) => {
      // Filter 1: Zoektekst filter - Controleer of de titel de zoektekst bevat
      if (filters.search) {
        const taskTitle = task.attributes.title.toLowerCase();
        const searchText = filters.search.toLowerCase();
        if (!taskTitle.includes(searchText)) {
          return false; // Taak bevat zoekterm niet, dus niet tonen
        }
      }

      // Filter 2: Status filter - Controleer of de taak de geselecteerde status heeft
      if (filters.status !== "all") {
        const taskStatus = task.attributes.taskStatus?.data?.attributes?.statusName
          ?.toLowerCase()
          .replaceAll(" ", "-");
        if (taskStatus !== filters.status) {
          return false; // Taak heeft niet de juiste status, dus niet tonen
        }
      }

      // Filter 3: Prioriteit filter - Controleer of de taak de geselecteerde prioriteit heeft
      if (filters.priority !== "all" && task.attributes.priority !== filters.priority) {
        return false; // Taak heeft niet de juiste prioriteit, dus niet tonen
      }

      return true; // Taak voldoet aan alle filters, dus tonen
    });
  };

  /**
   * Groepeer taken per kolom/status voor het Kanban bord
   * 
   * Deze functie neemt de gefilterde taken en groepeert ze in kolommen op basis van hun status.
   * Taken met status "Backlog" worden uitgesloten van het Kanban bord.
   */
  const groupByStatus = (tasks) => {
    // Definieer de kolommen voor het Kanban bord
    const groups = {
      "to-do": [],        // Te doen
      "in-progress": [],  // In uitvoering
      "ready-for-review": [], // Klaar voor review
      "done": [],        // Afgerond
    };

    // Filter de taken volgens de huidige filter instellingen
    const filteredTasks = filterTasks(tasks);

    // Verdeel de taken over de kolommen
    filteredTasks.forEach((task) => {
      // Bepaal de status van de taak en zet deze om naar het juiste formaat
      const status = task.attributes.taskStatus?.data?.attributes?.statusName
        ?.toLowerCase()
        .replaceAll(" ", "-");

      // Backlog taken tonen we niet op het Kanban bord
      if (status === "backlog") return;

      // Voeg taak toe aan de juiste kolom als die kolom bestaat
      if (groups[status]) {
        groups[status].push(task);
      }
    });

    return groups;
  };

  const grouped = tasksData
    ? groupByStatus(tasksData.data)
    : { "to-do": [], "in-progress": [], "ready-for-review": [], done: [] };

  const titleMap = {
    "to-do": "To Do",
    "in-progress": "In Progress",
    "ready-for-review": "Ready for Review",
    done: "Done",
  };

  /**
   * Event handler voor het klikken op een taak
   * Opent het dialoogvenster met taakdetails
   */
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  /**
   * Event handler voor het wijzigen van filter instellingen
   * Werkt voor zowel zoektekst, status als prioriteit filters
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Reset alle filters naar hun initiele waarden
   */
  const resetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
    });
  };

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />

      <main className="main-content">
        <header className="header">
          <div className="project-info">
            <h1 className="project-title">
              {projectLoading
                ? "Laden..."
                : actualProject?.name || "Project niet gevonden"}
            </h1>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddTask(true)}
            >
              Add Task
            </button>
            <Link
              to={`/projects/${projectId}/backlog`}
              className="btn btn-secondary"
            >
              View Backlog
            </Link>
          </div>
        </header>

        <div className="task-filter">
          <input
            type="text"
            name="search"
            placeholder="Zoeken..."
            value={filters.search}
            onChange={handleFilterChange}
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">Alle statussen</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="ready-for-review">Ready for Review</option>
            <option value="done">Done</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="all">Alle prioriteiten</option>
            <option value="High">Hoog</option>
            <option value="Medium">Middel</option>
            <option value="Low">Laag</option>
          </select>

          <button onClick={resetFilters}>Reset</button>
        </div>

        <section className="kanban-board">
          {Object.entries(grouped).map(([status, tasks]) => (
            <div key={status} className={`kanban-column ${status}`}>
              <div className="column-header">
                <div className="column-title">{titleMap[status]}</div>
                <div className="task-count">{tasks.length}</div>
              </div>
              <div className="column-body">
                {tasksLoading ? (
                  <p>Loading...</p>
                ) : tasks.length === 0 ? (
                  <p style={{ opacity: 0.6 }}>Geen taken</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      style={{ "--task-color": `var(--status-${status})` }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="task-header">
                        <h3 className="task-title">{task.attributes.title}</h3>
                        <div
                          className={`task-priority ${task.attributes.priority?.toLowerCase()}`}
                        >
                          {task.attributes.priority?.[0]}
                        </div>
                      </div>
                      <div className="task-meta">
                        {task.attributes.tags?.data?.map((tag) => (
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
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          statuses={statusData || []}
        />
      )}

      {showAddTask && (
        <AddTaskForm
          projectId={actualProjectId}
          onClose={() => setShowAddTask(false)}
          statuses={statusData || []}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
