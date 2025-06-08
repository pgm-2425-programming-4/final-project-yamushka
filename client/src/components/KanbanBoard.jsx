import React from "react";
import Sidebar from "./Sidebar";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";

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

  const groupByStatus = (tasks) => {
    const groups = { todo: [], progress: [], review: [], done: [] };
    tasks.forEach((task) => {
      const status =
        task.attributes.taskStatus?.data?.attributes?.statusName.toLowerCase();
      if (status === "to do") groups.todo.push(task);
      else if (status === "in progress") groups.progress.push(task);
      else if (status === "ready for review") groups.review.push(task);
      else if (status === "done") groups.done.push(task);
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
              {projectLoading ? "Loading..." : projectData.data.attributes.name}
            </h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary">Add Task</button>
            <Link
              to={`/projects/${projectId}/backlog`}
              className="btn btn-secondary"
            >
              View Backlog
            </Link>
          </div>
        </header>

        <section className="kanban-board">
          {["todo", "progress", "review", "done"].map((status) => {
            const titleMap = {
              todo: "To Do",
              progress: "In Progress",
              review: "Ready for Review",
              done: "Done",
            };

            return (
              <div key={status} className={`kanban-column ${status}`}>
                <div className="column-header">
                  <div className="column-title">{titleMap[status]}</div>
                  <div className="task-count">{grouped[status].length}</div>
                </div>
                <div className="column-body">
                  {tasksLoading ? (
                    <p>Loading...</p>
                  ) : (
                    grouped[status].map((task) => (
                      <div
                        key={task.id}
                        className="task-card"
                        style={{ "--task-color": `var(--status-${status})` }}
                      >
                        <div className="task-header">
                          <h3 className="task-title">
                            {task.attributes.title}
                          </h3>
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
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default KanbanBoard;
