import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/projects';

export default function Sidebar() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Projects</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p> Failed to load projects</p>}

      <ul className="sidebar-projects-list">
        {projects?.length === 0 && <p>No projects found</p>}
        {projects?.map(project => {
          const title = project.name || 'Untitled';
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
    </aside>
  );
}
