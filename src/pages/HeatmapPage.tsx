import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SURAT_CENTER, DEFAULT_ZOOM } from '../config/mapConfig';
import { usePotholeSync } from '../hooks/usePotholeSync';
import { api } from '../services/api';
import type { PotholeDetection } from '../types';
import { Map as MapIcon, FlameKindling } from 'lucide-react';

function HeatmapNodes({ data }: { data: PotholeDetection[] }) {
  const map = useMap();
  
  useEffect(() => {
    // Optionally auto-fit bounds or pan to the center of density
    if (data.length > 0) {
      map.flyTo([SURAT_CENTER.lat, SURAT_CENTER.lng], DEFAULT_ZOOM - 1, { duration: 1.5 });
    }
  }, [map, data]);

  // Render a density map using stacked SVG circles 
  // with high blur and opacity to create a native heatmap look.
  return (
    <>
      {data.map((pothole, i) => (
        <CircleMarker
          key={`core-${i}`}
          center={[pothole.lat, pothole.lng]}
          radius={8}
          pathOptions={{ color: 'none', fillColor: '#ef4444', fillOpacity: 0.8 }}
        />
      ))}
      {data.map((pothole, i) => (
        <CircleMarker
          key={`mid-${i}`}
          center={[pothole.lat, pothole.lng]}
          radius={25}
          pathOptions={{ color: 'none', fillColor: '#f97316', fillOpacity: 0.2 }}
        />
      ))}
      {data.map((pothole, i) => (
        <CircleMarker
          key={`outer-${i}`}
          center={[pothole.lat, pothole.lng]}
          radius={45}
          pathOptions={{ color: 'none', fillColor: '#facc15', fillOpacity: 0.1 }}
        />
      ))}
    </>
  );
}

export default function HeatmapPage() {
  const [data, setData] = useState<PotholeDetection[]>([]);
  usePotholeSync(5000); // Poll in background to simulate live updates

  useEffect(() => {
    api.getPotholes().then(setData);
    const interval = setInterval(() => {
      api.getPotholes().then(setData);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 pb-0 md:pb-4 gap-4">
      {/* Header Info Card */}
      <div className="card p-4 flex items-center gap-4 flex-shrink-0 animate-fade-in z-10 relative">
         <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
           <FlameKindling className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
         </div>
         <div>
           <h2 className="text-navy-900 font-bold text-xl">Density Heatmap</h2>
           <p className="text-slate-500 text-sm mt-0.5">Real-time localized cluster analysis of {data.length} structural defects</p>
         </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 card overflow-hidden relative z-0">
        <MapContainer
          center={[SURAT_CENTER.lat, SURAT_CENTER.lng]}
          zoom={DEFAULT_ZOOM - 1}
          className="w-full h-full z-0 font-sans cursor-crosshair"
          zoomControl={false}
          preferCanvas={true} // High perf rendering for multiple stacked opacities
        >
          {/* Dark map tile layer for better heatmap contrast */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          <HeatmapNodes data={data} />
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl px-4 py-3 min-w-[180px]">
          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest pl-1 mb-2.5 flex items-center gap-1.5">
            <MapIcon className="w-3 h-3" /> Zone Density
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <span className="text-slate-300 text-xs font-medium tracking-wide">High Cluster (10+)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              <span className="text-slate-300 text-xs font-medium tracking-wide">Medium (4-9)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-60 shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
              <span className="text-slate-400 text-xs tracking-wide">Isolated (1-3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
