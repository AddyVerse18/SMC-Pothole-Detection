import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { PotholeDetection } from '../types';
import { api } from '../services/api';

type FilterType = 'all' | 'critical' | 'pending' | 'resolved';

interface DashboardState {
  potholes: PotholeDetection[];
  isLoading: boolean;
  selectedPotholeId: string | null;
  activeFilter: FilterType;
  searchQuery: string;
  lastUpdated: Date | null;
}

interface DashboardActions {
  setSelectedPotholeId: (id: string | null) => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  refreshData: (silent?: boolean) => Promise<void>;
}

type DashboardContextType = DashboardState & DashboardActions;

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// --- Static Status Map (temporary until added to exact Pothole interface model) ---
export const STATUS_MAP: Record<string, string> = {
  'ph-001': 'pending',   // Assigned -> pending
  'ph-002': 'pending',   // In Queue -> pending
  'ph-003': 'pending',
  'ph-004': 'pending',
  'ph-005': 'resolved',  // Repaired -> resolved
  'ph-006': 'pending',
  'ph-007': 'pending',
  'ph-008': 'resolved',
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [potholes, setPotholes] = useState<PotholeDetection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPotholeId, setSelectedPotholeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await api.getPotholes();
      
      // Check if there's a new pothole and auto-select/pulse it
      // if it's not the initial load and the length grew.
      setPotholes((prev) => {
        if (prev.length > 0 && data.length > prev.length) {
          // Find the newest one (assuming sorted by timestamp desc or just grabbing the first if MOCK_DATA prepends)
          // MOCK_DATA currently doesn't actually grow, but this logic is here for the real Django backend.
          const newest = data[0]; 
          setSelectedPotholeId(newest.id);
        }
        return data;
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load potholes:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  // Compute filtered dataset
  const filteredPotholes = useMemo(() => {
    return potholes.filter((p) => {
      // 1. Text Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.roadName.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      // 2. Tab Filter
      if (activeFilter !== 'all') {
        if (activeFilter === 'critical' && p.severity !== 'critical') return false;
        const status = STATUS_MAP[p.id] || 'pending';
        if (activeFilter === 'pending' && status !== 'pending') return false;
        if (activeFilter === 'resolved' && status !== 'resolved') return false;
      }
      return true;
    });
  }, [potholes, activeFilter, searchQuery]);

  const value = {
    potholes: filteredPotholes,
    isLoading,
    selectedPotholeId,
    activeFilter,
    searchQuery,
    lastUpdated,
    setSelectedPotholeId,
    setActiveFilter,
    setSearchQuery,
    refreshData,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
