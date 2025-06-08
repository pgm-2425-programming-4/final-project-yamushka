import React from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";
import "../../public/css/reset.css";
import "../../public/css/main.css";

function KanbanBoard() {
  const { projectId } = useParams();
  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/tasks?filters[project][id][$eq]=${projectId}&populate=taskStatus,tags`
      );
      return res.data;
    },
    enabled: !!projectId,
  });

  // Helper: groepeer taken per status
  const groupByStatus = (tasks) => {
    const groups = { todo: [], progress: [], review: [], done: [] };
    tasks.forEach((task) => {
      const status =
        (task.attributes.taskStatus?.data?.attributes?.statusName || "")
          .toLowerCase();
      if (status.includes("todo")) groups.todo.push(task);
      else if (status.includes("progress")) groups.progress.push(task);
      else if (status.includes("review")) groups.review.push(task);
      else if (status.includes("done")) groups.done.push(task);
    });
    return groups;
  };

  const grouped = tasksData
    ? groupByStatus(tasksData.data)
    : { todo: [], progress: [], review: [], done: [] };

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />
      <main className="main-content">
        <header className="header">
          <div className="project-info">
            <h1 className="project-title">
              {projectLoading
                ? "Loading..."
                : projectData?.data?.attributes?.name || "Project Board"}
            </h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary">Add Task</button>
            <a
              href={`/projects/${projectId}/backlog`}
              className="btn btn-secondary"
            >
              View Backlog
            </a>
          </div>
        </header>
        <section className="kanban-board">
          {/* To Do Column */}
          <div className="kanban-column todo">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">TD</div>
                To Do
              </div>
              <div className="task-count">{grouped.todo.length}</div>
            </div>
            <div className="column-body">
              {tasksLoading ? (
                <p>Loading...</p>
              ) : (
                grouped.todo.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{ "--task-color": "var(--status-todo)" }}
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
          {/* In Progress Column */}
          <div className="kanban-column progress">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">P</div>
                In Progress
              </div>
              <div className="task-count">{grouped.progress.length}</div>
            </div>
            <div className="column-body">
              {tasksLoading ? (
                <p>Loading...</p>
              ) : (
                grouped.progress.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{ "--task-color": "var(--status-progress)" }}
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
          {/* Ready for Review Column */}
          <div className="kanban-column review">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">R</div>
                Ready for Review
              </div>
              <div className="task-count">{grouped.review.length}</div>
            </div>
            <div className="column-body">
              {tasksLoading ? (
                <p>Loading...</p>
              ) : (
                grouped.review.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{ "--task-color": "var(--status-review)" }}
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
          {/* Done Column */}
          <div className="kanban-column done">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">D</div>
                Done
              </div>
              <div className="task-count">{grouped.done.length}</div>
            </div>
            <div className="column-body">
              {tasksLoading ? (
                <p>Loading...</p>
              ) : (
                grouped.done.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    style={{ "--task-color": "var(--status-done)" }}
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
        </section>
      </main>
    </div>
  );
}

export default KanbanBoard;
