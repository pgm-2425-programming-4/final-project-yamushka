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

  console.log('📦 [Sidebar] Fetched projects:', projects);

  return (
    <aside style={{ width: '220px', padding: '1rem', background: '#f8f8f8' }}>
      <h2 style={{ marginBottom: '1rem' }}>Projects</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p>⚠️ Failed to load projects</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {projects?.length === 0 && <p>No projects found</p>}
        {projects?.map(project => {
          const title = project.name || 'Untitled';
          const documentId = project.documentId;
          if (!documentId) return null;

          return (
            <li key={project.id} style={{ marginBottom: '0.5rem' }}>
              <Link to={`/projects/${documentId}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
