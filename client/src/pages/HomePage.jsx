import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchAllProjects } from '../api/project/fetchAllProjects';

export default function HomePage() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchAllProjects,
  });

  if (isLoading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Projecten laden...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>Er is een fout opgetreden bij het laden van projecten</p>
      </div>
    );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Joanna Kanban</h1>
          <p className="hero-subtitle">Efficiënt projectbeheer en taakorganisatie</p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">Projecten</h2>
          {projects?.length > 0 && (
            <span className="project-count">
              {projects.length} project{projects.length !== 1 ? 'en' : ''}
            </span>
          )}
        </div>

        {projects?.length === 0 ? (
          <div className="empty-state">
            <h3>Nog geen projecten</h3>
            <p>Maak je eerste project aan om te beginnen</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects?.map((project, index) => (
              <article key={project.documentId} className="project-card">
                <div className="card-content">
                  <div className="project-info">
                    <div className="project-marker">{String(index + 1).padStart(2, '0')}</div>
                    <h3 className="project-title">{project.name}</h3>
                  </div>
                  <div className="project-actions">
                    <Link
                      to="/projects/$documentId"
                      params={{ documentId: project.documentId }}
                      className="action-link primary"
                    >
                      <span>Taakbord</span>
                      <div className="link-arrow">→</div>
                    </Link>
                    <Link
                      to="/projects/$documentId/backlog"
                      params={{ documentId: project.documentId }}
                      className="action-link secondary"
                    >
                      <span>Backlog</span>
                      <div className="link-arrow">→</div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
