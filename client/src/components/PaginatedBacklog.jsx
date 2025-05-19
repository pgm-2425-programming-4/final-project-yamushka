import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../../design/css/reset.css";
import "../../design/css/main.css";

export default function BacklogPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["backlogTasks"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:1337/api/tasks?filters[taskStatus][statusName][$eq]=Backlog&populate=taskStatus"
      );
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="main-content">
      <header className="header">
        <div className="project-info">
          <h1 className="project-title">Project Backlog</h1>
          <div className="project-badge">
            <span className="badge-dot"></span>
            PGM3
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary">
            <span>⚡</span>
            Quick Add
          </button>
          <button className="btn btn-primary">Add Task</button>
          <a href="index.html" className="btn btn-secondary">
            Back to Kanban
          </a>
        </div>
      </header>

      <section className="backlog-view active">
        <div className="backlog-container">
          <div className="backlog-header">
            <h2 className="backlog-title">Project Backlog</h2>
            <div className="backlog-controls">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks..."
                />
              </div>
              <button className="filter-btn">Filter</button>
              <button className="filter-btn">
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </div>

          <table className="backlog-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((task) => (
                <tr key={task.id}>
                  <td data-label="Task">{task.attributes.taskTitle}</td>
                  <td data-label="Status">
                    <span className="status-badge todo">
                      <span className="status-indicator"></span>
                      {task.attributes.taskStatus?.data?.attributes
                        ?.statusName || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
