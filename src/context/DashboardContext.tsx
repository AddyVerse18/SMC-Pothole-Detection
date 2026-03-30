import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { PotholeDetection, RoadSegment } from '../types';
import { api, socket, connectSocket, disconnectSocket, adaptDetection } from '../services/api';
import { useToasts } from '../hooks/useToasts';

/**
 * Industry-standard status mapping for the SMC Dashboard.
 * Maps backend status keys to frontend labels and Tailwind colors.
 */
export const STATUS_MAP = {
  pending: { 
    label: 'In Queue', 
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
  },
  assigned: { 
    label: 'Assigned', 
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
  },
  resolved: { 
    label: 'Repaired', 
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
  },
  critical: { 
    label: 'Critical', 
    color: 'bg-red-500/10 text-red-500 border-red-500/20' 
  }
};

type FilterType = 'all' | 'critical' | 'pending' | 'resolved';

export type SMCZone = 'All Zones' | 'Athwa' | 'Varachha' | 'Limbayat' | 'Katargam' | 'Adajan';

interface DashboardState {
  potholes: PotholeDetection[];
  segments: RoadSegment[];
  isLoading: boolean;
  selectedPotholeId: string | null;
  selectedSegmentId: string | null;
  activeFilter: FilterType;
  searchQuery: string;
  selectedZone: SMCZone;
  lastUpdated: Date | null;
}

interface DashboardActions {
  setSelectedPotholeId: (id: string | null) => void;
  setSelectedSegmentId: (id: string | null) => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedZone: (zone: SMCZone) => void;
  refreshData: (silent?: boolean) => Promise<void>;
  updatePotholeStatus: (id: string, status: string) => Promise<void>;
}

type DashboardContextType = DashboardState & DashboardActions;

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [potholes, setPotholes] = useState<PotholeDetection[]>([]);
  const [segments, setSegments] = useState<RoadSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPotholeId, setSelectedPotholeId] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<SMCZone>('All Zones');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [, addToast] = useToasts();

  const refreshData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [potholeData, segmentData] = await Promise.all([
        api.getPotholes(),
        api.getRoadSegments()
      ]);
      setPotholes(potholeData);
      setSegments(segmentData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const updatePotholeStatus = async (id: string, status: string) => {
    await api.updatePotholeStatus(id, status);
    await refreshData(true);
  };

  // Initial load & Socket Subscriptions
  useEffect(() => {
    refreshData();
    connectSocket();

    const handleNewDetection = (raw: any) => {
      const p = adaptDetection(raw);
      setPotholes(prev => [p, ...prev]);
      setLastUpdated(new Date());
      addToast(`Real-time Alert: New ${p.severity} hazard detected at ${p.roadName}`);
    };

    const handleNewBatch = (raws: any[]) => {
      const ps = raws.map(adaptDetection);
      setPotholes(prev => [...ps, ...prev]);
      setLastUpdated(new Date());
      addToast(`Batch Alert: ${ps.length} offline gateway records just synced`);
    };

    socket.on('new_detection', handleNewDetection);
    socket.on('new_detection_batch', handleNewBatch);

    return () => {
      socket.off('new_detection', handleNewDetection);
      socket.off('new_detection_batch', handleNewBatch);
      disconnectSocket();
    };
  }, []);

  // Compute filtered datasets
  const filteredPotholes = useMemo(() => {
    return potholes.filter((p) => {
      if (selectedZone !== 'All Zones' && p.zone !== selectedZone) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.roadName.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
      }
      if (activeFilter !== 'all') {
        if (activeFilter === 'critical' && p.severity !== 'critical') return false;
        if (activeFilter === 'pending' && p.status !== 'pending') return false;
        if (activeFilter === 'resolved' && p.status !== 'resolved') return false;
      }
      return true;
    });
  }, [potholes, activeFilter, searchQuery, selectedZone]);

  const filteredSegments = useMemo(() => {
    return segments.filter((s) => {
      if (selectedZone !== 'All Zones' && s.zone !== selectedZone) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!s.roadName.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
      }
      if (activeFilter === 'critical' && s.severity !== 'critical') return false;
      return true;
    });
  }, [segments, activeFilter, searchQuery, selectedZone]);

  const value = {
    potholes: filteredPotholes,
    segments: filteredSegments,
    isLoading,
    selectedPotholeId,
    selectedSegmentId,
    activeFilter,
    searchQuery,
    selectedZone,
    lastUpdated,
    setSelectedPotholeId,
    setSelectedSegmentId,
    setActiveFilter,
    setSearchQuery,
    setSelectedZone,
    refreshData,
    updatePotholeStatus,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
