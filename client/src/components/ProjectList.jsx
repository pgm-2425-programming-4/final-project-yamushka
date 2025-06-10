import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants/constants';

function ProjectList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error bij laden van projecten.</p>;

  return (
    <main className="main-content">
      <h1 className="project-title">Hallo, dit is mijn eindproject</h1>
      <p>joanna jodel</p>
      <h2>Alle projecten van Kanban</h2>
      <ul className="project-list">
        {data?.data?.map(project => {
          const name = project.name;
          const documentId = project.documentId;

          return (
            <li key={project.id} className="project-item">
              <Link to={`/projects/${documentId}`} className="project-link">
                {name || `Project ${documentId}`}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default ProjectList;
