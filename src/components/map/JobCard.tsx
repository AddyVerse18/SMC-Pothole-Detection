import { RoadSegment } from '../../types';
import { X, MapPin, AlertTriangle, CheckCircle, Clock, BarChart3, ChevronRight, HardHat } from 'lucide-react';

interface JobCardProps {
  segment: RoadSegment;
  onClose: () => void;
}

export default function JobCard({ segment, onClose }: JobCardProps) {
  const severityColors: Record<string, string> = {
    critical: 'text-red-600 bg-red-50 border-red-100',
    medium:   'text-orange-600 bg-orange-50 border-orange-100',
    healthy:  'text-emerald-600 bg-emerald-50 border-emerald-100',
  };
  const colorClass = severityColors[segment.severity] || severityColors.medium;

  return (
    <div className="absolute top-4 left-4 w-80 bg-white rounded-2xl shadow-premium border border-slate-200 overflow-hidden animate-in slide-in-from-left-4 duration-300 z-[1001]">
      {/* Header */}
      <div className="p-4 bg-navy-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-100 border-none`}>
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight leading-tight">{segment.roadName}</h3>
            <p className="text-navy-300 text-[10px] font-medium uppercase tracking-wider">{segment.zone} Zone</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/60 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        
        {/* Severity Badge */}
        <div className={`px-3 py-2 rounded-xl flex items-center justify-between border ${colorClass}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span className="text-xs font-bold uppercase tracking-wide">
              {segment.severity} Condition
            </span>
          </div>
          <span className="text-[10px] font-bold opacity-70">
            {segment.avgConfidence}% AI CONFIDENCE
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <BarChart3 size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Detections</span>
            </div>
            <p className="text-xl font-black text-navy-900">{segment.totalDetections}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
            </div>
            <p className="text-sm font-bold text-navy-900">Maintenance</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
           <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Repair Progress</span>
             <span className="text-xs font-bold text-navy-900">{segment.severity === 'healthy' ? '100%' : '24%'}</span>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ${segment.severity === 'healthy' ? 'bg-emerald-500 w-full' : 'bg-blue-600 w-1/4'}`}
             ></div>
           </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-3 bg-navy-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
          <HardHat size={14} className="text-amber-400" />
          DISPATCH MAINTENANCE TEAM
          <ChevronRight size={14} className="ml-auto opacity-50" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <CheckCircle size={12} className="text-slate-400" />
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Last scanned: 14 mins ago
        </span>
      </div>
    </div>
  );
}
