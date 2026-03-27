import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { DashboardProvider } from '../../context/DashboardContext';
import { SimulationProvider, useSimulation } from '../../context/SimulationContext';
import { ToastSystem } from '../shared/ToastSystem';
import { ManualEntryModal } from '../shared/ManualEntryModal';
import { useToasts } from '../../hooks/useToasts';

function DashboardLayoutContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addComplaint } = useSimulation();
  const [toasts, addToast] = useToasts();

  return (
    <div className="flex flex-col md:flex-row h-screen h-[100dvh] bg-slate-50 overflow-hidden font-sans text-navy-900">
      {/* Sidebar - Pass modal trigger */}
      <div className="order-last md:order-first z-40">
        <Sidebar onReportClick={() => setIsModalOpen(true)} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden order-first md:order-last">
        <Header />
        <main className="flex-1 overflow-auto relative bg-slate-50/50">
          <Outlet />
        </main>
      </div>

      <ManualEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          addComplaint(data as any);
          addToast("Manual complaint registered successfully.");
        }} 
      />
      <ToastSystem toasts={toasts} />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SimulationProvider>
      <DashboardProvider>
        <DashboardLayoutContent />
      </DashboardProvider>
    </SimulationProvider>
  );
}
