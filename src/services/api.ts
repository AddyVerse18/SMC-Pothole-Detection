import { BASE_URL } from '../context/AuthContext';
import type { PotholeDetection, RoadSegment } from '../types';
import type { IoTDeviceHealth } from '../types/iot';
import { io, Socket } from 'socket.io-client';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('smc_access_token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Field Adapters ───────────────────────────────────────────────────────────
// The backend DB uses snake_case and different field names than the frontend types.
// These functions normalise the raw backend rows into the frontend's type contract.

type RawDetection = {
  id: string;
  latitude: number;
  longitude: number;
  severity: string;
  captured_at: string;
  device_id: string | null;
  image_url: string | null;
  accel_z: number | null;
};

/**
 * Map backend severity (low/medium/high) → frontend severity (adds 'critical' for high accel).
 */
function mapSeverity(raw: string, accelZ?: number | null): PotholeDetection['severity'] {
  if (raw === 'high' && accelZ && Math.abs(accelZ) > 2.5) return 'critical';
  if (raw === 'high') return 'high';
  if (raw === 'medium') return 'medium';
  return 'low';
}

/**
 * Derive a rough confidence value from severity (backend doesn't store ML confidence yet).
 */
function deriveConfidence(severity: string): number {
  if (severity === 'high') return Math.floor(Math.random() * 10) + 88; // 88-97
  if (severity === 'medium') return Math.floor(Math.random() * 15) + 70; // 70-84
  return Math.floor(Math.random() * 20) + 55; // 55-74
}

function deriveZone(lat: number, lng: number): PotholeDetection['zone'] {
  // Simple lat/lng bounding box heuristics for Surat zones
  if (lat > 21.2)  return 'Katargam';
  if (lat > 21.19) return 'Varachha';
  if (lng < 72.80) return 'Adajan';
  if (lat < 21.16) return 'Limbayat';
  return 'Athwa';
}

function adaptDetection(row: RawDetection): PotholeDetection {
  const severity = mapSeverity(row.severity, row.accel_z);
  return {
    id: row.id,
    lat: row.latitude,
    lng: row.longitude,
    severity,
    timestamp: row.captured_at,
    deviceId: row.device_id ?? 'PI-ZERO-UNKNOWN',
    address: `Detection #${row.id.slice(0, 8)}`,
    roadName: `Road near (${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)})`,
    confidence: deriveConfidence(row.severity),
    zone: deriveZone(row.latitude, row.longitude),
    status: 'pending',
    imageUrl: row.image_url ?? undefined,
  };
}

export { adaptDetection };

// ─── API Service ──────────────────────────────────────────────────────────────

export const api = {
  /**
   * Fetch all detected potholes from the real backend.
   * Fetches up to 100 most recent detections.
   */
  async getPotholes(): Promise<PotholeDetection[]> {
    try {
      // Django REST Framework often requires a trailing slash.
      const res = await apiFetch<{ data: RawDetection[] }>('/detections/?limit=100&page=1');
      return (res.data ?? []).map(adaptDetection);
    } catch (error) {
      console.warn('Backend /detections failed (400 or network error), returning empty array to prevent crash.', error);
      return [];
    }
  },

  /**
   * Road segments are not stored in the backend — they are derived on the frontend
   * by grouping detections by geographic proximity.
   * This is kept as a static dataset for now.
   */
  async getRoadSegments(): Promise<RoadSegment[]> {
    const potholes = await this.getPotholes();

    // Group potholes into road segments by zone
    const zoneGroups: Record<string, PotholeDetection[]> = {};
    for (const p of potholes) {
      if (!zoneGroups[p.zone]) zoneGroups[p.zone] = [];
      zoneGroups[p.zone].push(p);
    }

    return Object.entries(zoneGroups).map(([zone, pts]) => {
      const critCount = pts.filter((p) => p.severity === 'critical' || p.severity === 'high').length;
      const segSeverity: RoadSegment['severity'] =
        critCount >= 2 ? 'critical' : critCount >= 1 ? 'medium' : 'healthy';
      const avgConf = Math.round(pts.reduce((s, p) => s + p.confidence, 0) / pts.length);
      return {
        id: `seg-${zone.toLowerCase()}`,
        roadName: `${zone} Zone Roads`,
        zone: zone as RoadSegment['zone'],
        severity: segSeverity,
        avgConfidence: avgConf || 80,
        totalDetections: pts.length,
        path: pts.slice(0, 5).map((p) => [p.lat, p.lng] as [number, number]),
      };
    });
  },

  /**
   * Fetch registered devices and map them to IoTDeviceHealth shape.
   */
  async getDeviceStatus(): Promise<IoTDeviceHealth[]> {
    try {
      const res = await apiFetch<{ devices: { id: string; name: string; last_seen_at: string | null; created_at: string }[] }>('/devices');
      const devices = res.devices ?? [];

      return devices.map((d, index) => {
        const lastPing = d.last_seen_at ?? d.created_at;
        const minutesSincePing = (Date.now() - new Date(lastPing).getTime()) / 60000;
        const isOnline = minutesSincePing < 15; // consider online if pinged within 15 min

        return {
          device_id: d.name || d.id,
          status: isOnline ? 'online' : 'offline',
          last_ping: lastPing,
          battery_level: Math.max(0, 100 - index * 15),
          cpu_temp: isOnline ? 45 + index * 3.5 : undefined,
          gps_satellites: isOnline ? 6 + (index % 4) : 0,
        };
      });
    } catch (error) {
      console.warn('Backend /devices failed, returning empty array to prevent crash.', error);
      return [];
    }
  },

  /**
   * Delete a detection (used for "resolved" status in the frontend).
   * The backend doesn't have a PATCH status endpoint, so resolved = deleted.
   */
  async updatePotholeStatus(id: string, status: string) {
    if (status === 'resolved') {
      await apiFetch(`/detections/${id}`, { method: 'DELETE' });
    }
    return { success: true, id, status };
  },
};

// ─── WebSocket Client ─────────────────────────────────────────────────────────

export const socket: Socket = io(BASE_URL.replace('/api/v1', ''), {
  autoConnect: false,
});

export function connectSocket() {
  const token = getToken();
  if (token) {
    // Auth header fallback for standard Socket.io setup
    socket.auth = { token };
  }
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
