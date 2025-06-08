import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import KanbanBoard from "./components/KanbanBoard";
import BacklogPage from "./components/BacklogPage";
import ProjectList from "./components/ProjectList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:projectId" element={<KanbanBoard />} />
          <Route
            path="/projects/:projectId/backlog"
            element={<BacklogPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
