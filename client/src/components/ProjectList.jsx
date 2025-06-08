import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProjectList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:1337/api/projects");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <main className="main-content">
      <h1 className="project-title">Projecten</h1>
      <ul className="nav-list">
        {data.data.map((project) => (
          <li key={project.id} className="nav-item">
            <Link className="nav-link" to={`/projects/${project.id}`}>
              {project.attributes.name || `Project ${project.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
