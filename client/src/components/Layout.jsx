import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Toast from './shared/Toast';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}
