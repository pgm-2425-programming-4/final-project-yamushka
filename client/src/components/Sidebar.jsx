import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProject } from '../api/projects';
import { useState } from 'react';

export default function Sidebar() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const handleCreateProject = async e => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      await createProject({
        name: newProjectName.trim(),
      });

      // Refresh de projects lijst
      queryClient.invalidateQueries(['projects']);

      // Reset form
      setNewProjectName('');
      setShowProjectForm(false);
    } catch (error) {
      console.error('Fout bij aanmaken project:', error);
      alert('Fout bij aanmaken van project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <aside className="sidebar">
      {/* Home link met logo */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          Home
        </Link>
      </div>

      <div className="sidebar-projects-section">
        <div className="sidebar-title-container">
        
          <button
            className="add-project-button"
            onClick={() => setShowProjectForm(!showProjectForm)}
          >
            + Nieuw Project
          </button>
        </div>

        {/* Nieuw project formulier */}
        {showProjectForm && (
          <form onSubmit={handleCreateProject} className="new-project-form">
            <input
              type="text"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Project naam..."
              className="new-project-input"
              disabled={isCreating}
            />
            <div className="new-project-buttons">
              <button
                type="submit"
                disabled={isCreating || !newProjectName.trim()}
                className="new-project-save"
              >
                {isCreating ? 'Aanmaken...' : 'Opslaan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProjectForm(false);
                  setNewProjectName('');
                }}
                className="new-project-cancel"
              >
                Annuleren
              </button>
            </div>
          </form>
        )}

        {isLoading && <p>Laden...</p>}
        {error && <p>Fout bij laden projecten</p>}

        <ul className="sidebar-projects-list">
          {projects?.length === 0 && <p>Geen projecten gevonden</p>}
          {projects?.map(project => {
            const title = project.name || 'Naamloos';
            const projectDocumentId = project.documentId;

            return (
              <li key={project.id} className="sidebar-project-item">
                <div className="sidebar-project-container">
                  <Link
                    to={`/projects/${projectDocumentId}`}
                    onClick={() => console.log(`📁 [Clicked project]: ${title}\n`, project)}
                    className="sidebar-project-link"
                  >
                    {title}
                  </Link>
                  <Link
                    to={`/projects/${projectDocumentId}/backlog`}
                    className="sidebar-backlog-link"
                  >
                    Backlog →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
