import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeatmapPage from './pages/HeatmapPage';
import DeviceStatusPage from './pages/DeviceStatusPage';
import AdminPage from './pages/AdminPage';
import ZonalAnalyticsPage from './pages/ZonalAnalyticsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import DashboardLayout from './components/layout/DashboardLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="heatmaps" element={<HeatmapPage />} />
          <Route path="zonal" element={<ZonalAnalyticsPage />} />
          <Route path="devices" element={<DeviceStatusPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
