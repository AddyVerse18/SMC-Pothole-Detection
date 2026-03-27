export const SURAT_CENTER = { lat: 21.1702, lng: 72.8311 };
export const DEFAULT_ZOOM = 13;

export const SMC_ZONES: Record<string, { center: { lat: number, lng: number }, zoom: number }> = {
  'All Zones': { center: SURAT_CENTER, zoom: 13 },
  'Athwa': { center: { lat: 21.1760, lng: 72.8220 }, zoom: 14.5 },
  'Varachha': { center: { lat: 21.1650, lng: 72.8550 }, zoom: 14.5 },
  'Limbayat': { center: { lat: 21.1450, lng: 72.8450 }, zoom: 14.5 },
  'Katargam': { center: { lat: 21.1950, lng: 72.8250 }, zoom: 14.5 },
  'Adajan': { center: { lat: 21.1850, lng: 72.7950 }, zoom: 14.5 },
};

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string || '';
