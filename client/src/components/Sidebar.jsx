import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { useState } from "react";

function Sidebar({ currentProjectId }) {
  const [showInput, setShowInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects/`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (name) => {
      return axios.post(`${API_URL}/projects/`, {
        data: { name },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setNewProjectName("");
      setShowInput(false);
    },
  });

  return (
    <aside className="sidebar">
      {/* logo link ===================================================*/}
      <div className="logo-section">
        <Link to="/" className="brand-name">
          <h1 className="brand-name">Kanban Board</h1>
        </Link>
      </div>

      {/* start nav */}
      <nav>
        <div className="nav-section">
          <h3 className="nav-title">Projecten</h3>

          {/* start lijst van projecten =======================================================*/}

          <ul className="nav-list">
            {isLoading && <li>Laden</li>}
            {isError && <li>Fout bij laden</li>}
            {data?.data?.map((project) => {
              const name = project.name;

              return (
                <li key={project.id} className="nav-item">
                  <Link
                    to={`/projects/${project.documentId}`}
                    className={`nav-link${
                      currentProjectId === project.documentId ? " active" : ""
                    }`}
                  >
                    {name || `Project ${project.documentId}`}
                    {currentProjectId === project.documentId && (
                      <span className="project-indicator" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="nav-section">
          {showInput ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newProjectName.trim()) {
                  mutation.mutate(newProjectName.trim());
                }
              }}
              style={{ marginTop: "1rem", display: "flex", gap: 8 }}
            >
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Projectnaam"
                autoFocus
                style={{
                  flex: 1,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  padding: 6,
                }}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={mutation.isLoading}
              >
                Toevoegen
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowInput(false);
                  setNewProjectName("");
                }}
              >
                Annuleer
              </button>
            </form>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowInput(true)}
              style={{ marginTop: "1rem" }}
            >
              Project toevoegen
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
