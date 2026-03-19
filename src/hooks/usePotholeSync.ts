import { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * usePotholeSync
 * 
 * Custom hook to poll the Django backend every 5 seconds.
 * In a real environment, this ensures the React dashboard is a 
 * "Live Listener" for the Raspberry Pi Edge devices.
 */
export function usePotholeSync(intervalMs: number = 5000) {
  const { refreshData } = useDashboard();

  useEffect(() => {
    // Initial fetch happens in DashboardContext, 
    // so we only need to set up the polling interval here.
    const intervalId = setInterval(() => {
      refreshData(true); // Pass a silent flag to avoid full-screen spinners
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [refreshData, intervalMs]);
}
