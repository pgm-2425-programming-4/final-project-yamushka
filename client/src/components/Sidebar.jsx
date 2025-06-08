import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constants/constants";

function Sidebar({ currentProjectId }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects`);
      console.log("Sidebar projecten data:", res.data); 
      return res.data;
    },
  });

  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1 className="brand-name">Kanban</h1>
      </div>

      <nav>
        <div className="nav-section">
          <h3 className="nav-title">Projecten</h3>
          <ul className="nav-list">
            {isLoading && <li>Laden...</li>}
            {isError && <li>Fout bij laden</li>}
            {data?.data?.map((project) => {
    
              const name = project.name;
              return (
                <li key={project.id} className="nav-item">
                  <Link
                    to={`/projects/${project.id}`}
                    className={`nav-link${
                      currentProjectId == project.id ? " active" : ""
                    }`}
                  >
                    {name || `Project ${project.id}`}
                    {currentProjectId == project.id && (
                      <span className="project-indicator" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem" }}
          >
            Project toevoegen
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
