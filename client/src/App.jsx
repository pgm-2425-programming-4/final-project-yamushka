import { BrowserRouter, Routes, Route } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Backlog from "./components/Backlog";
import ProjectList from "./components/ProjectList";

import "../public/css/reset.css";
import "../public/css/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<KanbanBoard />} />
        <Route path="/projects/:projectId/backlog" element={<Backlog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
