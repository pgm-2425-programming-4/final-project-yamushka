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
    <aside style={{ width: '220px', padding: '1rem', background: '#f8f8f8' }}>
      <h2 style={{ marginBottom: '1rem' }}>Projects</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p> Failed to load projects</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {projects?.length === 0 && <p>No projects found</p>}
        {projects?.map(project => {
          const title = project.name || 'Untitled';
          const projectDocumentId = project.documentId;

          return (
            <li key={project.id} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  to={`/projects/${projectDocumentId}`}
                  onClick={() => console.log(`📁 [Clicked project]: ${title}\n`, project)}
                  style={{ marginBottom: '4px' }}
                >
                  {title}
                </Link>
                <Link
                  to={`/projects/${projectDocumentId}/backlog`}
                  style={{ fontSize: '0.85em', paddingLeft: '12px', color: '#666' }}
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
