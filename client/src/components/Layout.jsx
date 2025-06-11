
import { Outlet } from '@tanstack/react-router';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
