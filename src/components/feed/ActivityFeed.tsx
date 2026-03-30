import { useEffect, useRef } from 'react';
import type { PotholeDetection } from '../../types';
import { useDashboard, STATUS_MAP } from '../../context/DashboardContext';
// simulation removed
import { Clock, Cpu, MapPin, Activity, Search, Filter, CameraOff } from 'lucide-react';

type JobStatus = 'In Queue' | 'Assigned' | 'Repaired';

const SEVERITY_DOT: Record<PotholeDetection['severity'], string> = {
  critical: 'dot-critical',
  high:     'dot-high',
  medium:   'dot-medium',
  low:      'dot-low',
};

const SEVERITY_LABEL: Record<PotholeDetection['severity'], string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
};

function statusBadgeClass(status: JobStatus) {
  if (status === 'Repaired') return 'badge-resolved';
  if (status === 'Assigned') return 'badge-assigned';
  return 'badge-inqueue';
}

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m ago`;
}

interface TaskCardProps {
  pothole: PotholeDetection;
  isSelected: boolean;
  onClick: () => void;
}

function TaskCard({ pothole, isSelected, onClick }: TaskCardProps) {
  const statusKey = pothole.status as keyof typeof STATUS_MAP;
  const rawStatus = STATUS_MAP[statusKey]?.label || 'In Queue';
  const status: JobStatus = rawStatus === 'Repaired' ? 'Repaired' : rawStatus === 'Assigned' ? 'Assigned' : 'In Queue';
  
  const elRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view if selected from map
  useEffect(() => {
    if (isSelected && elRef.current) {
      elRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <div
      ref={elRef}
      onClick={onClick}
      className={`card p-0 overflow-hidden hover:shadow-card-hover transition-all duration-200 group cursor-pointer border-2 ${
        isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-transparent'
      }`}
    >
      {/* Thumbnail row */}
      <div className="relative h-28 bg-slate-100 overflow-hidden flex items-center justify-center">
        {pothole.imageUrl ? (
          <img
            src={pothole.imageUrl}
            alt={`Capture ${pothole.id}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 opacity-50">
            <CameraOff className="w-6 h-6 mb-1" />
            <span className="text-[9px] uppercase font-black tracking-widest">No Capture</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Bottom-left: severity + ID */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
          <span className={SEVERITY_DOT[pothole.severity]} />
          <span className="text-white text-xs font-semibold">{SEVERITY_LABEL[pothole.severity]}</span>
        </div>

        {/* Top-right: device ID pill */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          {pothole.deviceId}
        </div>
      </div>

      {/* Content */}
      <div className={`p-3 ${isSelected ? 'bg-indigo-50/30' : 'bg-white'}`}>
        {/* Status + ID */}
        <div className="flex items-center justify-between mb-2">
          <span className={statusBadgeClass(status)}>{status}</span>
          <span className="text-slate-400 text-[10px] font-mono leading-none tracking-wider">{pothole.id}</span>
        </div>

        {/* Road name */}
        <p className="text-navy-900 text-sm font-semibold leading-snug mb-2 pr-1">{pothole.roadName}</p>

        {/* Meta */}
        <div className="space-y-1.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate leading-none">{pothole.address}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {timeAgo(pothole.timestamp)}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3 h-3" />
              {pothole.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  const { 
    isLoading, 
    selectedPotholeId, 
    setSelectedPotholeId,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    potholes: complaints
  } = useDashboard();

  const filteredComplaints = complaints.filter((p: PotholeDetection) => {
    const q = (searchQuery || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const road = (p.roadName || '').toLowerCase();
    
    const matchSearch = id.includes(q) || road.includes(q);
    
    // Custom filter mapping for DashboardContext filters
    if (activeFilter === 'pending') return p.status === 'pending' && matchSearch;
    if (activeFilter === 'resolved') return p.status === 'resolved' && matchSearch;
    if (activeFilter === 'critical') return p.severity === 'critical' && matchSearch;
    
    return matchSearch;
  });

  return (
    <div className="w-[340px] flex-shrink-0 bg-slate-50 border-l border-slate-200 flex flex-col h-full z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-navy-900 font-bold text-sm">Action Feed</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 text-[11px] font-semibold uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="flex flex-col gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="feed-search"
              name="feed-search"
              type="text"
              placeholder="Search by road or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-navy-900 placeholder-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-3 h-3 text-slate-400 flex-shrink-0 mr-0.5" />
            {(['all', 'critical', 'pending', 'resolved'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 bg-slate-50 space-y-3 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            Loading fleet data...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-20 text-slate-400">
            <Search className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredComplaints.map((pothole: PotholeDetection) => (
            <TaskCard
              key={pothole.id}
              pothole={pothole}
              isSelected={selectedPotholeId === pothole.id}
              onClick={() => setSelectedPotholeId(selectedPotholeId === pothole.id ? null : pothole.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white">
         <p className="text-slate-400 text-[11px] text-center font-medium">
           Showing {filteredComplaints.length} active jobs
         </p>
      </div>
    </div>
  );
}
