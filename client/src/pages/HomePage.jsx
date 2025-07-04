import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchAllProjects } from '../api/project/fetchAllProjects';
import { deleteProject } from '../api/project/deleteProject';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/shared/States';
import { showToast, showConfirm } from '../components/shared/Toast';

export default function HomePage() {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchAllProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast('Project succesvol verwijderd', 'success');
    },
    onError: error => {
      showToast(`Fout bij verwijderen: ${error.message}`, 'error');
    },
  });

  const handleDeleteProject = async project => {
    const confirmDelete = await showConfirm(
      `Weet je zeker dat je het project "${project.name}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`
    );

    if (confirmDelete) {
      deleteMutation.mutate(project.documentId);
    }
  };

  if (isLoading) return <LoadingSpinner message="Projecten laden..." />;
  if (error)
    return <ErrorMessage message="Er is een fout opgetreden bij het laden van projecten" />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Kanban board</h1>
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
          <EmptyState
            title="Nog geen projecten"
            message="Maak je eerste project aan om te beginnen"
          />
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
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="action-link delete"
                      disabled={deleteMutation.isPending}
                    >
                      <span>{deleteMutation.isPending ? 'Verwijderen...' : 'Verwijder'}</span>
                    </button>
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
