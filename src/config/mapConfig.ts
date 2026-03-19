export const SURAT_CENTER = { lat: 21.1702, lng: 72.8311 };
export const DEFAULT_ZOOM = 13;
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';

// Map ID for styled dark map (requires a Map ID created in Google Cloud Console)
// Leave empty to use default Google Maps styling
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string || '';
