import React from "react";

function KanbanBoard() {
  return (
    <div className="kanban-wrapper">
      {}
      <aside className="sidebar">
        <div className="logo-section">
          <h1 className="brand-name">kanban</h1>
        </div>
        <nav>
          <div className="nav-section">
            <h3 className="nav-title">Navigation</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link">Dashboard</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">My Tasks</a>
              </li>
            </ul>
          </div>
          <div className="nav-section">
            <h3 className="nav-title">Projects</h3>
            <ul className="nav-list">
              {/* dynamiczna lista projektów ze Strapi */}
              <li className="nav-item">
                <a href="#" className="nav-link active">PGM3 <span className="project-indicator"></span></a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">PGM4</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">New Project</a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      {/* main */}
      <main className="main-content">
        <header className="header">
          <div className="project-info">
            <h1 className="project-title">Project PGM4</h1>
            <div className="project-badge">
              <span className="badge-dot"></span>
              Active project
            </div>
          </div>
          <div className="header-actions">
            {}
            <button className="btn btn-primary">Add Task</button>
            <a href="/backlog" className="btn btn-secondary">View Backlog</a>
          </div>
        </header>
        {/* Kanban board columns */}
        <section className="kanban-board">
          {/* To Do Column */}
          <div className="kanban-column todo">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">TD</div>
                To Do
              </div>
              <div className="task-count">2</div>
            </div>
            <div className="column-body">
              {/* dynamiczne taski ze Strapi (status: To Do) */}
              <div className="task-card" style={{"--task-color": "var(--status-todo)"}}>
                <div className="task-header">
                  <h3 className="task-title">Create</h3>
                  <div className="task-priority medium">M</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag infra">
                    <span className="tag-dot"></span>
                    Infra
                  </span>
                </div>
              </div>
              <div className="task-card" style={{"--task-color": "var(--status-todo)"}}>
                <div className="task-header">
                  <h3 className="task-title">Some task for PGM3</h3>
                  <div className="task-priority low">L</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag docs">
                    <span className="tag-dot"></span>
                    Documentation
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* progress column */}
          <div className="kanban-column progress">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">P</div>
                In Progress
              </div>
              <div className="task-count">1</div>
            </div>
            <div className="column-body">
              {/* dynamiczne taski ze Strapi (status: In Progress) */}
              <div className="task-card" style={{"--task-color": "var(--status-progress)"}}>
                <div className="task-header">
                  <h3 className="task-title">Set up Strapi</h3>
                  <div className="task-priority high">H</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag infra">
                    <span className="tag-dot"></span>
                    Infra
                  </span>
                  <span className="task-tag backend">
                    <span className="tag-dot"></span>
                    Back-end
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* for Review Column */}
          <div className="kanban-column review">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">R</div>
                Ready for Review
              </div>
              <div className="task-count">2</div>
            </div>
            <div className="column-body">
              {/* dynamiczne taski ze Strapi (status: Ready for Review) */}
              <div className="task-card" style={{"--task-color": "var(--status-review)"}}>
                <div className="task-header">
                  <h3 className="task-title">tasky task</h3>
                  <div className="task-priority medium">M</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag frontend">
                    <span className="tag-dot"></span>
                    Front-end
                  </span>
                </div>
              </div>
              <div className="task-card" style={{"--task-color": "var(--status-review)"}}>
                <div className="task-header">
                  <h3 className="task-title">bla bla</h3>
                  <div className="task-priority medium">M</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag frontend">
                    <span className="tag-dot"></span>
                    Front-end
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Done Column */}
          <div className="kanban-column done">
            <div className="column-header">
              <div className="column-title">
                <div className="column-icon">D</div>
                Done
              </div>
              <div className="task-count">2</div>
            </div>
            <div className="column-body">
              {/* dynamiczne taski ze Strapi (status: Done) */}
              <div className="task-card" style={{"--task-color": "var(--status-done)"}}>
                <div className="task-header">
                  <h3 className="task-title">Initialize Git</h3>
                  <div className="task-priority low">L</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag infra">
                    <span className="tag-dot"></span>
                    Infra
                  </span>
                </div>
              </div>
              <div className="task-card" style={{"--task-color": "var(--status-done)"}}>
                <div className="task-header">
                  <h3 className="task-title">Document</h3>
                  <div className="task-priority medium">M</div>
                </div>
                <div className="task-meta">
                  <span className="task-tag backend">
                    <span className="tag-dot"></span>
                    Back-end
                  </span>
                  <span className="task-tag docs">
                    <span className="tag-dot"></span>
                    Documentation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default KanbanBoard;
