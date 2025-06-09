
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

function KanbanBoard() {
  const { projectId } = useParams(); // DIT is de documentId uit de URL
  const [setShowAddTask] = useState(false);

  // 🔹 Eerst: zoek het project op basis van documentId
  const {
    data: projectData,
    isLoading: projectLoading,

  } = useQuery({
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

  // 🔹 Daarna: haal alle taken op voor dat project-ID
  const {
    data: tasksData,
    isLoading: tasksLoading,

  } = useQuery({
    queryKey: ["tasks", actualProjectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/tasks?filters[project][id][$eq]=${actualProjectId}&populate=taskStatus,tags`
      );
      return res.data;
    },
    enabled: !!actualProjectId,
  });

  // 🔹 Taken groeperen per status
  const groupByStatus = (tasks) => {
    const groups = {
      "to-do": [],
      "in-progress": [],
      "ready-for-review": [],
      done: [],
    };
    tasks.forEach((task) => {
      const status = task.attributes.taskStatus?.data?.attributes?.statusName
        ?.toLowerCase()
        .replaceAll(" ", "-");
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

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />

      <main className="main-content">
        <header className="header">
          <div className="project-info">
            <h1 className="project-title">
              {projectLoading
                ? "Laden..."
                : actualProject?.attributes?.name || "Project niet gevonden"}
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
    </div>
  );
}

export default KanbanBoard;
