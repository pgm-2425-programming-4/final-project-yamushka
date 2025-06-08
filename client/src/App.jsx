import { BrowserRouter, Routes, Route } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Backlog from "./components/Backlog";

import "../../design/css/reset.css";
import "../../design/css/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/backlog" element={<Backlog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
