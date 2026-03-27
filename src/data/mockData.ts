import type { PotholeDetection, RoadSegment } from '../types';

export const ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'seg-001',
    roadName: 'Ring Road',
    zone: 'Athwa',
    severity: 'critical',
    avgConfidence: 89,
    totalDetections: 12,
    path: [
      [21.1895, 72.8315],
      [21.1870, 72.8335],
      [21.1845, 72.8360]
    ]
  },
  {
    id: 'seg-002',
    roadName: 'Dumas Road',
    zone: 'Athwa',
    severity: 'medium',
    avgConfidence: 76,
    totalDetections: 5,
    path: [
      [21.1680, 72.7950],
      [21.1620, 72.7880],
      [21.1550, 72.7820]
    ]
  },
  {
    id: 'seg-003',
    roadName: 'Udhna Main Road',
    zone: 'Limbayat',
    severity: 'critical',
    avgConfidence: 94,
    totalDetections: 18,
    path: [
      [21.1675, 72.8365],
      [21.1580, 72.8405],
      [21.1480, 72.8445]
    ]
  },
  {
    id: 'seg-004',
    roadName: 'Varachha Main Road',
    zone: 'Varachha',
    severity: 'medium',
    avgConfidence: 82,
    totalDetections: 7,
    path: [
      [21.2045, 72.8385],
      [21.2065, 72.8425],
      [21.2085, 72.8465]
    ]
  },
  {
    id: 'seg-005',
    roadName: 'L.P. Savani Road',
    zone: 'Adajan',
    severity: 'healthy',
    avgConfidence: 98,
    totalDetections: 0,
    path: [
      [21.1965, 72.7935],
      [21.1985, 72.7915],
      [21.2015, 72.7895]
    ]
  }
];

export const MOCK_POTHOLES: PotholeDetection[] = [
  {
    id: 'ph-001',
    lat: 21.1870,
    lng: 72.8335,
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    deviceId: 'PI-ZERO-001',
    address: 'Ring Road, Surat',
    roadName: 'Ring Road',
    confidence: 97,
    zone: 'Athwa',
    status: 'pending',
  },
  {
    id: 'ph-002',
    lat: 21.1620,
    lng: 72.7880,
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    deviceId: 'PI-ZERO-001',
    address: 'Dumas Road, Piplod',
    roadName: 'Dumas Road',
    confidence: 91,
    zone: 'Athwa',
    status: 'assigned',
  },
  {
    id: 'ph-003',
    lat: 21.1580,
    lng: 72.8405,
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    deviceId: 'PI-ZERO-001',
    address: 'Udhna Main Road, Surat',
    roadName: 'Udhna Main Road',
    confidence: 84,
    zone: 'Limbayat',
    status: 'pending',
  },
  {
    id: 'ph-004',
    lat: 21.2065,
    lng: 72.8425,
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    deviceId: 'PI-ZERO-001',
    address: 'Varachha Main Road',
    roadName: 'Varachha Main Road',
    confidence: 88,
    zone: 'Varachha',
    status: 'pending',
  },
  {
    id: 'ph-005',
    lat: 21.1985,
    lng: 72.7915,
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
    deviceId: 'PI-ZERO-001',
    address: 'L.P. Savani Road, Adajan',
    roadName: 'L.P. Savani Road',
    confidence: 76,
    zone: 'Adajan',
    status: 'resolved',
  }
];

export const getRecentPotholes = (count: number = 5): PotholeDetection[] => {
  return [...MOCK_POTHOLES]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
};
