import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { DashboardProvider } from '../../context/DashboardContext';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen h-[100dvh] bg-slate-100 overflow-hidden font-sans text-navy-900">
      {/* Mobile Sidebar is placed at bottom, Desktop is at left */}
      <div className="order-last md:order-first z-20">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-hidden relative order-first md:order-last">
        <DashboardProvider>
          <Outlet />
        </DashboardProvider>
      </main>
    </div>
  );
}
