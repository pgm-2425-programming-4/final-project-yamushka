import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";
import TaskDialog from "./TaskDialog";
import AddTaskForm from "./AddTaskForm";

function KanbanBoard() {
  const { projectId } = useParams();
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  // Haal statussen op voor het hele systeem
  const { data: statusData } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/statuses`);
      return res.data;
    },
  });

  // Haal het project op via documentId
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
        `${API_URL}/projects?filters[documentId][$eq]=[tasks][populate]=taskStatus`
      );

      const project = res.data.data?.[0];
      return {
        data: project?.attributes?.tasks?.data || [],
      };
    },
    enabled: !!projectId,
  });

  // Filteren van taken
  const filterTasks = (tasks) => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // Filter op zoekterm
      if (
        filters.search &&
        !task.attributes.title
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filter op status
      if (filters.status !== "all") {
        const taskStatus =
          task.attributes.taskStatus?.data?.attributes?.statusName
            ?.toLowerCase()
            .replaceAll(" ", "-");
        if (taskStatus !== filters.status) {
          return false;
        }
      }

      // Filter op prioriteit
      if (
        filters.priority !== "all" &&
        task.attributes.priority !== filters.priority
      ) {
        return false;
      }

      return true;
    });
  };

  // Groepeer taken per status
  const groupByStatus = (tasks) => {
    const groups = {
      "to-do": [],
      "in-progress": [],
      "ready-for-review": [],
      done: [],
    };

    const filteredTasks = filterTasks(tasks);

    filteredTasks.forEach((task) => {
      const status = task.attributes.taskStatus?.data?.attributes?.statusName
        ?.toLowerCase()
        .replaceAll(" ", "-");

      // Skip backlog taken
      if (status === "backlog") return;

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

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      {/* Taak details dialog */}
      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          statuses={statusData?.data || []}
        />
      )}

      {/* Nieuwe taak toevoegen */}
      {showAddTask && (
        <AddTaskForm
          projectId={actualProjectId}
          onClose={() => setShowAddTask(false)}
          statuses={statusData?.data || []}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
