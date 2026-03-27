import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PotholeDetection } from '../types';
import { MOCK_POTHOLES, ROAD_SEGMENTS } from '../data/mockData';
import { genId, SMCZone } from '../data/simulationData';

interface Notification {
  id: number;
  text: string;
  ts: number;
  isNew: boolean;
}

interface SimulationContextType {
  complaints: PotholeDetection[];
  notifications: Notification[];
  unreadCount: number;
  addComplaint: (complaint: PotholeDetection) => void;
  resolveComplaint: (id: string) => void;
  markInProgress: (id: string) => void;
  markNotificationsRead: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Helper function
function pick<T>(arr: T[] | readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<PotholeDetection[]>(MOCK_POTHOLES);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'Auto-detection alerts activated in Surat District', ts: Date.now() - 60000, isNew: true },
    { id: 2, text: 'Action required: PHE-2024-003 escalated to Critical severity', ts: Date.now() - 3600000, isNew: true },
  ]);
  const [idCounter, setIdCounter] = useState(MOCK_POTHOLES.length + 10); // Start after seed data

  const unreadCount = notifications.filter(n => n.isNew).length;

  const addComplaint = (complaint: PotholeDetection) => {
    const hasId = !!complaint.id;
    const finalComplaint = hasId ? complaint : {
      ...complaint,
      id: genId(idCounter)
    };

    setComplaints(prev => [finalComplaint, ...prev]);
    const newNotif = {
      id: Date.now(),
      text: `New report logged: ${finalComplaint.id} at ${finalComplaint.roadName}`,
      ts: Date.now(),
      isNew: true
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    if (!hasId) {
      setIdCounter(prev => prev + 1);
    }
  };

  const resolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
  };

  const markInProgress = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'assigned' } : c));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  // IoT Simulation Logic - Snaps to ROAD_SEGMENTS paths
  useEffect(() => {
    const timer = setInterval(() => {
      // 10% chance every 15 seconds to generate a complaint
      if (Math.random() < 0.1) {
        const sev = Math.random() > 0.8 ? pick(['critical', 'high']) : pick(['medium', 'low']);
        
        // Pick a random road segment and a random point on its path for accuracy
        const segment = pick(ROAD_SEGMENTS);
        const point = pick(segment.path);
        
        const newComp: PotholeDetection = {
          id: genId(idCounter),
          lat: point[0],
          lng: point[1],
          severity: sev as PotholeDetection['severity'],
          timestamp: new Date().toISOString(),
          deviceId: pick(['PI-ZERO-001', 'PI-ZERO-002', 'PI-ZERO-003']),
          address: `${segment.roadName}, Surat`,
          roadName: segment.roadName,
          confidence: Math.floor(80 + Math.random() * 18),
          zone: segment.zone as SMCZone,
          status: 'pending'
        };
        
        addComplaint(newComp);
        setIdCounter(prev => prev + 1);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [idCounter]);

  return (
    <SimulationContext.Provider value={{ 
      complaints, notifications, unreadCount, 
      addComplaint, resolveComplaint, markInProgress, markNotificationsRead 
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
}
