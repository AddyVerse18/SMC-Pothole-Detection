export interface PotholeDetection {
  id: string;
  lat: number;
  lng: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  deviceId: string;
  address: string;
  roadName: string;
  confidence: number; // 0-100
  zone: 'Athwa' | 'Varachha' | 'Limbayat' | 'Katargam' | 'Adajan';
  status: 'pending' | 'resolved' | 'assigned' | 'in-queue';
}

export interface RoadSegment {
  id: string;
  roadName: string;
  path: [number, number][]; // Array of [lat, lng]
  severity: 'critical' | 'medium' | 'healthy';
  avgConfidence: number;
  zone: 'Athwa' | 'Varachha' | 'Limbayat' | 'Katargam' | 'Adajan';
  totalDetections: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
