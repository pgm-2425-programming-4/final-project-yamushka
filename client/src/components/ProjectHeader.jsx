import React from 'react';
import { Link } from 'react-router-dom';

function ProjectHeader({ projectId, projectName, isLoading, onAddTask }) {
  return (
    <header className="header">

      <div className="project-info">
        <h1 className="project-title">
          {isLoading ? 'Laden...' : projectName || 'Project niet gevonden'}
        </h1>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={onAddTask}>
          Add Task
        </button>
        <Link to={`/projects/${projectId}/backlog`} className="btn btn-secondary">
          View Backlog
        </Link>
      </div>
    </header>
  );
}

export default ProjectHeader;
