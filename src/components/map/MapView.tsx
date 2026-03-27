import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { SURAT_CENTER, DEFAULT_ZOOM, SMC_ZONES } from '../../config/mapConfig';
import { useDashboard } from '../../context/DashboardContext';
import { useSimulation } from '../../context/SimulationContext';
import PotholeInfoWindow from './PotholeInfoWindow';
import JobCard from './JobCard';
import { ZoomIn, ZoomOut, Crosshair, Map as MapIcon, Flame } from 'lucide-react';

function MapController() {
  const map = useMap();
  const { selectedPotholeId, selectedZone } = useDashboard();
  const { complaints } = useSimulation();

  useEffect(() => {
    if (!map || !selectedPotholeId) return;
    const hp = complaints.find(p => p.id === selectedPotholeId);
    if (hp) {
      map.flyTo([hp.lat, hp.lng], 16, { duration: 1.5 });
    }
  }, [map, selectedPotholeId, complaints]);

  useEffect(() => {
    if (!map || selectedZone === 'All Zones') {
        if (selectedZone === 'All Zones' && !selectedPotholeId) {
            map.flyTo([SURAT_CENTER.lat, SURAT_CENTER.lng], DEFAULT_ZOOM, { duration: 1.5 });
        }
        return;
    }
    
    const zoneData = SMC_ZONES[selectedZone];
    if (zoneData) {
      map.flyTo([zoneData.center.lat, zoneData.center.lng], zoneData.zoom, { duration: 1.5 });
    }
  }, [map, selectedZone]);

  return null;
}

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
    className: 'custom-leaflet-marker',
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
  const { selectedPotholeId, setSelectedPotholeId, setSelectedSegmentId, selectedSegmentId } = useDashboard();
  const { complaints } = useSimulation();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const mapRef = useRef<any>(null);

  const severityCounts = {
    critical: complaints.filter((p) => p.severity === 'critical').length,
    high:     complaints.filter((p) => p.severity === 'high').length,
    medium:   complaints.filter((p) => p.severity === 'medium').length,
    low:      complaints.filter((p) => p.severity === 'low').length,
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      <MapContainer
        center={[SURAT_CENTER.lat, SURAT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapController />

        {/* Heatmap Layer */}
        {showHeatmap && complaints.map((p) => (
          <React.Fragment key={`heat-frag-${p.id}`}>
            <CircleMarker
              key={`heat-outer-${p.id}`}
              center={[p.lat, p.lng]}
              radius={35}
              pathOptions={{ fillColor: '#4ade80', fillOpacity: 0.1, stroke: false }}
            />
            <CircleMarker
              key={`heat-mid-${p.id}`}
              center={[p.lat, p.lng]}
              radius={20}
              pathOptions={{ fillColor: '#f59e0b', fillOpacity: 0.2, stroke: false }}
            />
            <CircleMarker
              key={`heat-inner-${p.id}`}
              center={[p.lat, p.lng]}
              radius={8}
              pathOptions={{ fillColor: '#b91c1c', fillOpacity: 0.4, stroke: false }}
            />
          </React.Fragment>
        ))}

        {/* Individual Pothole Markers */}
        {!showHeatmap && complaints.map((pothole) => {
          const isSelected = selectedPotholeId === pothole.id;
          return (
            <Marker
              key={`marker-${pothole.id}`}
              position={[pothole.lat, pothole.lng]}
              icon={createMarkerIcon(pothole.severity, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedPotholeId(isSelected ? null : pothole.id);
                  setSelectedSegmentId(null);
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

        {/* Selected Segment Info (Overlay) */}
        {selectedSegmentId && (
          <div className="absolute top-4 left-4 z-[1000] w-72">
             <JobCard 
               segment={null as any} /* We don't have segment details easily accessible now */
               onClose={() => setSelectedSegmentId(null)} 
             />
          </div>
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-1 flex flex-col overflow-hidden">
          <button 
            onClick={() => mapRef.current?.zoomIn()}
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-b border-slate-100"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={() => mapRef.current?.zoomOut()}
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={() => mapRef.current?.flyTo([SURAT_CENTER.lat, SURAT_CENTER.lng], DEFAULT_ZOOM)}
          className="p-3 bg-white hover:bg-slate-50 text-indigo-600 rounded-xl shadow-xl border border-slate-200 transition-all active:scale-95"
          title="Recenter Map"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-3 rounded-xl shadow-xl border transition-all active:scale-95 flex items-center gap-2 ${
            showHeatmap 
              ? 'bg-indigo-600 border-indigo-500 text-white' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {showHeatmap ? <MapIcon className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase tracking-wider pr-1">
            {showHeatmap ? 'Map' : 'Heat'}
          </span>
        </button>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[180px]">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Severity Legend</h3>
        <div className="space-y-2">
          {[
            { label: 'Critical', color: '#ef4444', count: severityCounts.critical },
            { label: 'High',     color: '#f59e0b', count: severityCounts.high },
            { label: 'Medium',   color: '#eab308', count: severityCounts.medium },
            { label: 'Low',      color: '#10b981', count: severityCounts.low },
          ].map(({ label, color, count }) => (
            <div key={`legend-${label}`} className="flex items-center justify-between gap-5 py-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold text-navy-800">{label}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
