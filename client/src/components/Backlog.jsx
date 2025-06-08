import React from "react";

function Backlog() {
  return (
    <>
      <aside className="sidebar">
        <div className="logo-section">
          <h1 className="brand-name">Tasks kanban</h1>
        </div>
        <nav>
          <div className="nav-section">
            <h3 className="nav-title">Navigation</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  My Tasks
                </a>
              </li>
            </ul>
          </div>
          <div className="nav-section">
            <h3 className="nav-title">Projects</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="index.html" className="nav-link active">
                  PGM3
                  <span className="project-indicator"></span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  PGM4
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  New Project
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <main className="main-content">
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
                  <th>Priority</th>
                  <th>Tags</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Task">Github</td>
                  <td data-label="Status">
                    <span className="status-badge todo">
                      <span className="status-indicator"></span>
                      To Do
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge medium">M</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag infra">
                      <span className="tag-dot"></span>
                      Infra
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 15, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">Set up Strapi</td>
                  <td data-label="Status">
                    <span className="status-badge progress">
                      <span className="status-indicator"></span>
                      In Progress
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge high">H</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag infra">
                      <span className="tag-dot"></span>
                      Infra
                    </span>
                    <span className="task-tag backend">
                      <span className="tag-dot"></span>
                      Back-end
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 12, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">Add</td>
                  <td data-label="Status">
                    <span className="status-badge review">
                      <span className="status-indicator"></span>
                      Review
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge medium">M</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag frontend">
                      <span className="tag-dot"></span>
                      Front-end
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 10, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">blabla</td>
                  <td data-label="Status">
                    <span className="status-badge review">
                      <span className="status-indicator"></span>
                      Review
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge medium">M</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag frontend">
                      <span className="tag-dot"></span>
                      Front-end
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 11, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">Initialize Git</td>
                  <td data-label="Status">
                    <span className="status-badge done">
                      <span className="status-indicator"></span>
                      Done
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge low">L</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag infra">
                      <span className="tag-dot"></span>
                      Infra
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 8, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">Document</td>
                  <td data-label="Status">
                    <span className="status-badge done">
                      <span className="status-indicator"></span>
                      Done
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge medium">M</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag backend">
                      <span className="tag-dot"></span>
                      Back-end
                    </span>
                    <span className="task-tag docs">
                      <span className="tag-dot"></span>
                      Documentation
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 9, 2025</span>
                  </td>
                </tr>
                <tr>
                  <td data-label="Task">Some task for PGM3</td>
                  <td data-label="Status">
                    <span className="status-badge todo">
                      <span className="status-indicator"></span>
                      To Do
                    </span>
                  </td>
                  <td data-label="Priority">
                    <div className="priority-badge low">L</div>
                  </td>
                  <td data-label="Tags">
                    <span className="task-tag docs">
                      <span className="tag-dot"></span>
                      Documentation
                    </span>
                  </td>
                  <td data-label="Due Date">
                    <span className="date-cell">May 18, 2025</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="pagination">
              <div className="pagination-info">Showing 1 to 7 of 7 tasks</div>
              <div className="pagination-controls">
                <button className="pagination-btn">←</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">→</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Backlog;
