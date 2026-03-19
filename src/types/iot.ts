/**
 * API Contract for the Django Backend
 * This defines the exact JSON structure the Raspberry Pi Zero 2 W sends to Django,
 * and what Django must serve to the React Frontend.
 */

export interface IoTPotholePayload {
  device_id: string;      // e.g., "PI-ZERO-001"
  id: string;             // Unique detection ID from Django DB
  latitude: number;       // From NEO-6M GPS
  longitude: number;      // From NEO-6M GPS
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;     // e.g., 95.5 (from YOLOv8)
  image_url: string;      // S3 or local Django media URL for the frame
  timestamp: string;      // ISO 8601 string
}

export interface IoTDeviceHealth {
  device_id: string;
  status: 'online' | 'offline';
  last_ping: string;      // ISO 8601 string
  battery_level: number;  // 0-100%
  cpu_temp?: number;      // Pi Zero CPU temp in Celsius
  gps_satellites: number; // Number of fixed satellites from NEO-6M
}
