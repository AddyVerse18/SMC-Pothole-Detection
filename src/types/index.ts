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
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
