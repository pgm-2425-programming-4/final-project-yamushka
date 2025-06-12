import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import ProjectForm from './ProjectForm';

// styles
import '../styles/main.css';

export default function Header() {
  const [showProjectForm, setShowProjectForm] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="brand">
          <span className="brand-text">Joanna Kanban</span>
        </Link>

        <div className="header-actions">
          <Link to="/about" className="header-link">
            About
          </Link>
          <button className="header-link" onClick={() => setShowProjectForm(true)}>
            Nieuw Project
          </button>
        </div>
      </div>

      {showProjectForm && (
        <div className="form-overlay">
          <ProjectForm
            onSuccess={() => setShowProjectForm(false)}
            onCancel={() => setShowProjectForm(false)}
          />
        </div>
      )}
    </header>
  );
}
