import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { SURAT_CENTER, DEFAULT_ZOOM } from '../../config/mapConfig';
import { useDashboard } from '../../context/DashboardContext';
import PotholeInfoWindow from './PotholeInfoWindow';
import { Search, MapPin, ZoomIn, ZoomOut, Crosshair, Map as MapIcon } from 'lucide-react';

function MapController() {
  const map = useMap();
  const { selectedPotholeId, potholes } = useDashboard();

  useEffect(() => {
    if (!map || !selectedPotholeId) return;
    
    // Find the pothole and animate camera
    const hp = potholes.find(p => p.id === selectedPotholeId);
    if (hp) {
      map.flyTo([hp.lat, hp.lng], 16, { duration: 1.5 });
    }
  }, [map, selectedPotholeId, potholes]);

  return null;
}

// Custom Leaflet DivIcon factory
const createMarkerIcon = (severity: string, isSelected: boolean) => {
  const colors = {
    critical: 'bg-red-500 border-red-200',
    high:     'bg-amber-500 border-amber-200',
    medium:   'bg-yellow-500 border-yellow-200',
    low:      'bg-emerald-500 border-emerald-200',
  };
  const bgColor = colors[severity as keyof typeof colors] || colors.medium;
  const shadowClasses = isSelected 
    ? 'ring-4 ring-indigo-500/30 shadow-lg scale-110 z-[1000]' 
    : 'shadow-sm hover:scale-110';

  return divIcon({
    className: 'custom-leaflet-marker', // Needs CSS reset in index.css
    html: `
      <div class="relative w-8 h-8 -ml-4 -mt-8 flex items-center justify-center cursor-pointer transition-transform duration-300">
        <div class="absolute inset-0 w-8 h-8 bg-white rounded-full ${shadowClasses} flex items-center justify-center">
           <div class="w-5 h-5 rounded-full ${bgColor} border-2" />
        </div>
        ${isSelected ? `<div class="absolute -bottom-1 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function MapView() {
  const { potholes, selectedPotholeId, setSelectedPotholeId } = useDashboard();
  const mapRef = useRef<any>(null);

  const severityCounts = {
    critical: potholes.filter((p) => p.severity === 'critical').length,
    high:     potholes.filter((p) => p.severity === 'high').length,
    medium:   potholes.filter((p) => p.severity === 'medium').length,
    low:      potholes.filter((p) => p.severity === 'low').length,
  };

  return (
    <div className="relative flex-1 h-full rounded-xl overflow-hidden border border-slate-200 shadow-card">
      <MapContainer
        center={[SURAT_CENTER.lat, SURAT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0 font-sans"
        zoomControl={false} // Disable default zoom to use our custom buttons
        ref={mapRef}
      >
        {/* CartoDB Voyager — light, clean enterprise base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController />

        {potholes.map((pothole) => {
          const isSelected = selectedPotholeId === pothole.id;
          return (
            <Marker
              key={pothole.id}
              position={[pothole.lat, pothole.lng]}
              icon={createMarkerIcon(pothole.severity, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedPotholeId(isSelected ? null : pothole.id);
                },
              }}
            >
              {isSelected && (
                <Popup className="custom-leaflet-popup" closeButton={false}>
                  <PotholeInfoWindow 
                    pothole={pothole} 
                    onClose={() => setSelectedPotholeId(null)} 
                  />
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* ── Floating controls — top right ── */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        
        {/* Zoom controls */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden flex flex-col">
          <button
            onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() + 1)}
            className="px-2.5 py-1.5 hover:bg-slate-50 border-b border-slate-100 text-slate-600 flex items-center justify-center transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() - 1)}
            className="px-2.5 py-1.5 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Re-center */}
        <button
          onClick={() => {
            mapRef.current?.flyTo([SURAT_CENTER.lat, SURAT_CENTER.lng], DEFAULT_ZOOM);
            setSelectedPotholeId(null);
          }}
          className="map-control justify-center"
          title="Reset view to Surat"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Detection count badge — top left ── */}
      <div className="absolute top-3 left-3 z-10 bg-white border border-slate-200 rounded-lg shadow-card px-3 py-1.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-navy-900 text-xs font-semibold">{potholes.length} potholes (Filtered)</span>
      </div>

      {/* ── Severity legend — bottom left ── */}
      <div className="absolute bottom-4 left-3 z-10 bg-white border border-slate-200 rounded-lg shadow-card px-3.5 py-2.5">
        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <MapIcon className="w-3 h-3" /> Leaflet Base
        </p>
        {[
          { label: 'Critical', color: '#ef4444', count: severityCounts.critical },
          { label: 'High',     color: '#f59e0b', count: severityCounts.high },
          { label: 'Medium',   color: '#eab308', count: severityCounts.medium },
          { label: 'Low',      color: '#10b981', count: severityCounts.low },
        ].map(({ label, color, count }) => (
          <div key={label} className="flex items-center justify-between gap-5 py-0.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-slate-600 text-xs">{label}</span>
            </div>
            <span className="text-slate-400 text-xs font-mono tabular-nums">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
