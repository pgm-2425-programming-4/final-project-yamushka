import { Outlet } from '@tanstack/react-router';
import Header from './Header';

// styles
import '../styles/main.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
