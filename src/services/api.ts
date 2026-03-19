import { MOCK_POTHOLES } from '../data/mockData';
import type { PotholeDetection } from '../types';
import type { IoTPotholePayload, IoTDeviceHealth } from '../types/iot';

/**
 * MOCK API SERVICE
 * Connect this to your real backend by swapping the implementation
 * of these functions with actual fetch() or axios.get() calls.
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch all detected potholes
   * Replace with: return axios.get('/api/potholes').then(res => res.data);
   */
  async getPotholes(): Promise<PotholeDetection[]> {
    await delay(300); // 300ms is enough for local dashboard dev
    return [...MOCK_POTHOLES];
  },

  /**
   * Fetch device fleet status from Django / Raspberry Pi stats
   */
  async getDeviceStatus(): Promise<IoTDeviceHealth[]> {
    await delay(300);
    const uniqueIds = [...new Set(MOCK_POTHOLES.map((p) => p.deviceId))];
    
    return uniqueIds.map((id, index) => {
      // Create some pseudo-random but stable hardware stats for the demo
      const isOnline = index !== 2; // Make one mock device offline
      return {
        device_id: id,
        status: isOnline ? 'online' : 'offline',
        last_ping: new Date().toISOString(),
        battery_level: Math.max(0, 100 - index * 18),
        cpu_temp: isOnline ? 45 + (index * 4.2) : undefined, // Pi Zero 2 W typical running temp
        gps_satellites: isOnline ? 6 + (index % 4) : 0,      // NEO-6M typically sees 6-10
      };
    });
  },

  /**
   * Update the status of a specific pothole (Mock)
   * Replace with: return axios.patch(`/api/potholes/${id}`, { status });
   */
  async updatePotholeStatus(id: string, status: string) {
    await delay(400);
    console.log(`[API MOCK] Updated pothole ${id} to ${status}`);
    return { success: true, id, status };
  }
};
