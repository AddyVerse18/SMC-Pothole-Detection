import { useDashboard } from '../context/DashboardContext';
import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ZonalAnalyticsPage() {
  const { potholes, segments, selectedZone } = useDashboard();

  // Filter segments for the selected zone
  const zoneSegments = segments.filter(s => selectedZone === 'All Zones' || s.zone === selectedZone);

  // Calculate stats
  const totalPotholes = potholes.length;
  const resolvedPotholes = potholes.filter(p => p.status === 'resolved').length;
  const efficiency = totalPotholes > 0 ? Math.round((resolvedPotholes / totalPotholes) * 100) : 0;
  
  // GIS Stats: Average Road Health
  const criticalSegments = zoneSegments.filter(s => s.severity === 'critical').length;
  const roadHealthRating = zoneSegments.length > 0 
    ? Math.round(((zoneSegments.length - criticalSegments) / zoneSegments.length) * 100) 
    : 100;

  // Mock "City Average" for comparison
  const cityAverage = 12; 
  const cityAvgEfficiency = 68;
  const cityAvgRoadHealth = 72;

  const isAboveAvg = totalPotholes > cityAverage;
  const diffPercent = Math.abs(Math.round(((totalPotholes - cityAverage) / cityAverage) * 100));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Zonal Command Center</h2>
          <p className="text-slate-500 text-sm mt-1">
            Analyzing <span className="font-semibold text-navy-900">{selectedZone}</span> performance vs. city-wide benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
          <BarChart2 size={18} className="text-blue-600" />
          <span className="text-sm font-bold text-navy-900">Live Zonal Data</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pothole Frequency Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Detection Frequency</h3>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">Frequency vs Avg</span>
          </div>
          <div className="p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Current Zone</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-navy-900">{totalPotholes}</span>
                <span className="text-slate-400 font-medium">potholes</span>
              </div>
            </div>
          </div>
          <div className={`px-6 py-4 bg-slate-50 flex items-center gap-2 mt-auto ${isAboveAvg ? 'text-amber-600' : 'text-emerald-600'}`}>
            {isAboveAvg ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
            <p className="text-sm font-bold">
              {diffPercent}% {isAboveAvg ? 'higher' : 'lower'}
            </p>
          </div>
        </div>

        {/* Road Health (GIS Segments) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Avg Road Health</h3>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">GIS Intensity</span>
          </div>
          <div className="p-8 space-y-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Segment Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-navy-900">{roadHealthRating}%</span>
              <span className="text-slate-400 font-medium">healthy</span>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 flex items-center justify-between mt-auto">
             <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
               Avg: <span className="text-navy-900 font-bold">{cityAvgRoadHealth}% City</span>
             </p>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roadHealthRating >= cityAvgRoadHealth ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
               {roadHealthRating >= cityAvgRoadHealth ? 'OPTIMAL' : 'BELOW AVG'}
             </span>
          </div>
        </div>

        {/* Efficiency Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Repair Efficiency</h3>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">Performance</span>
          </div>
          <div className="p-8 space-y-4">
               <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
                  <span className="text-5xl font-extrabold text-navy-900 tracking-tighter">{efficiency}%</span>
               </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 flex items-center justify-between mt-auto">
             <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
               Benchmark: <span className="text-navy-900 font-bold">{cityAvgEfficiency}%</span>
             </p>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${efficiency >= cityAvgEfficiency ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
               {efficiency >= cityAvgEfficiency ? 'PASSING' : 'FAILING'}
             </span>
          </div>
        </div>

      </div>

      {/* Priority Table Stub */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-navy-900">Zonal Priority Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Pothole ID</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Detection Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {potholes.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-navy-900">{p.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-navy-900">{p.roadName}</p>
                    <p className="text-[10px] text-slate-400">{p.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      p.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {p.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors">
                      Dispatch Team
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
