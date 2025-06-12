import { Outlet } from '@tanstack/react-router';
import Header from './Header';


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
