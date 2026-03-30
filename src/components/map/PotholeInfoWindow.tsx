import type { PotholeDetection } from '../../types';
import { X, MapPin, Clock, Cpu, Activity, CameraOff } from 'lucide-react';

interface PotholeInfoWindowProps {
  pothole: PotholeDetection;
  onClose: () => void;
}

const SEVERITY_BADGE: Record<PotholeDetection['severity'], string> = {
  critical: 'badge-critical',
  high:     'badge-pending', // amber
  medium:   'badge-inqueue', // yellow/slate
  low:      'badge-resolved',// emerald
};

const SEVERITY_LABEL: Record<PotholeDetection['severity'], string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
};

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

export default function PotholeInfoWindow({ pothole, onClose }: PotholeInfoWindowProps) {
  return (
    <div className="w-[280px] bg-white rounded-xl shadow-kpi border border-slate-200 overflow-hidden text-navy-900 font-sans tracking-normal leading-normal">
      {/* Header image */}
      <div className="relative h-[130px] bg-slate-100 flex items-center justify-center overflow-hidden">
        {pothole.imageUrl ? (
          <img 
            src={pothole.imageUrl}
            alt={`Pothole ${pothole.id}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 opacity-50">
            <CameraOff className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
          </div>
        )}
        {/* Gradient for badge readability */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Top-left: Severity */}
        <div className="absolute top-2 left-2">
          <span className={SEVERITY_BADGE[pothole.severity]}>
            {SEVERITY_LABEL[pothole.severity]}
          </span>
        </div>
        
        {/* Top-right: Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-600 transition-colors shadow-sm z-10"
        >
          <X size={14} />
        </button>
        
        {/* Bottom-right: Device pill */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
          #{pothole.id}
        </div>
      </div>

      {/* Info body */}
      <div className="p-3.5 flex flex-col gap-2.5 bg-white">
        <h3 className="m-0 text-[13px] font-semibold text-navy-900 leading-tight">
          {pothole.roadName}
        </h3>

        <div className="flex flex-col gap-1.5">
          {/* GPS */}
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-indigo-500 flex-shrink-0" />
            <code className="text-[11px] text-slate-500 font-mono">
              {pothole.lat.toFixed(5)}°N, {pothole.lng.toFixed(5)}°E
            </code>
          </div>

          {/* Device */}
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-slate-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-500">
              Unit: <strong className="text-navy-900 font-medium">{pothole.deviceId}</strong>
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] text-slate-500">
              Found: <strong className="text-navy-900 font-medium">{timeAgo(pothole.timestamp)}</strong>
            </span>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-amber-500 flex-shrink-0" />
            <span className="text-[11px] text-slate-500">
              Confidence: <strong className="text-navy-900 font-medium">{pothole.confidence}%</strong>
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mt-1 pt-2 border-t border-slate-100">
          <p className="m-0 text-[11px] text-slate-500 leading-tight flex gap-1.5">
            <span className="opacity-70">📍</span> {pothole.address}
          </p>
        </div>
      </div>
    </div>
  );
}
