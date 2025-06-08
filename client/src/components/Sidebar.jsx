import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constants/constants";
import "../../public/css/reset.css";
import "../../public/css/main.css";

function Sidebar({ currentProjectId }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects`);
      return res.data;
    },
  });
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1 className="brand-name">kanban</h1>
      </div>
      <nav>
        <div className="nav-section">
          <h3 className="nav-title">Navigation</h3>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">My Tasks</Link>
            </li>
          </ul>
        </div>
        <div className="nav-section">
          <h3 className="nav-title">Projects</h3>
          <ul className="nav-list">
            {isLoading && <li>Loading...</li>}
            {isError && <li>Error loading projects</li>}
            {data && data.data.map((project) => (
              <li key={project.id} className="nav-item">
                <Link
                  to={`/projects/${project.id}`}
                  className={`nav-link${currentProjectId == project.id ? " active" : ""}`}
                >
                  {project.attributes.name || `Project ${project.id}`}
                  {currentProjectId == project.id && <span className="project-indicator"></span>}
                </Link>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>Add Project</button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;