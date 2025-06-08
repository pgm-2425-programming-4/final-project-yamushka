import React from "react";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/constants";
import "../../public/css/reset.css";
import "../../public/css/main.css";

function Backlog() {
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
    queryKey: ["backlogTasks", projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/tasks?filters[project][id][$eq]=${projectId}&filters[taskStatus][statusName][$eq]=Backlog&populate=taskStatus,tags`
      );
      return res.data;
    },
    enabled: !!projectId,
  });

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />
      <main className="main-content">
        <section className="backlog-view active">
          <div className="backlog-container">
            <div className="backlog-header">
              <h2 className="backlog-title">
                {projectLoading ? "Loading..." : `${projectData?.data?.attributes?.name} Backlog`}
              </h2>
              <div className="backlog-controls">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input type="text" className="search-input" placeholder="Search tasks..." />
                </div>
                <button className="filter-btn">Filter</button>
              </div>
            </div>
            <table className="backlog-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Tags</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasksLoading ? (
                  <tr><td colSpan="5">Loading...</td></tr>
                ) : tasksData?.data?.length ? (
                  tasksData.data.map((task) => (
                    <tr key={task.id}>
                      <td>{task.attributes.title}</td>
                      <td>{task.attributes.taskStatus?.data?.attributes?.statusName}</td>
                      <td>{task.attributes.priority}</td>
                      <td>
                        {task.attributes.tags?.data?.map((tag) => tag.attributes.name).join(", ")}
                      </td>
                      <td>{task.attributes.dueDate || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No tasks found</td></tr>
                )}
              </tbody>
            </table>
            {/* Pagination could be added here */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Backlog;
