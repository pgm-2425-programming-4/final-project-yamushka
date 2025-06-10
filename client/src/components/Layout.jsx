import Sidebar from './Sidebar';
import { Outlet, useParams } from 'react-router-dom';

function Layout() {
  const { projectId } = useParams();

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
