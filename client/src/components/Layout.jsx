import { Outlet } from '@tanstack/react-router';
import Sidebar from './Sidebar';
import '../styles/layout.css';

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
