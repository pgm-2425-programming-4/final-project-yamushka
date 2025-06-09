
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../constants/constants";

function ProjectList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects?populate=*`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading </p>;
  if (isError) return <p>Error</p>;

  return (
    <main className="main-content">
      <h1 className="project-title">Alle projecten van Kanban</h1>
      <ul className="project-list">
        {data?.data?.map((project) => {
          const name = project.attributes?.name;
          return (
            <li key={project.id} className="project-item">
              <Link to={`/projects/${project.name}`} className="project-link">
                {name || `Project ${project.name}`}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default ProjectList;
