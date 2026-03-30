import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { PotholeDetailModal } from '../components/shared/PotholeDetailModal';
// The SURAT_AREAS is removed from simulationData since we are deleting it soon.
const SURAT_AREAS = ['Athwa', 'Varachha', 'Limbayat', 'Katargam', 'Adajan'];

export default function ComplaintsPage() {
  const { potholes: complaints, updatePotholeStatus } = useDashboard();
  const [selectedPotholeId, setSelectedPotholeId] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) || 
                          c.roadName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchSeverity = severityFilter === 'all' || c.severity === severityFilter;
      const matchArea = areaFilter === 'all' || c.address.includes(areaFilter);
      return matchSearch && matchStatus && matchSeverity && matchArea;
    });
  }, [complaints, search, statusFilter, severityFilter, areaFilter]);

  const selectedPothole = complaints.find(c => c.id === selectedPotholeId) || null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">System Records</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all detected road anomalies</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
           <AlertCircle className="w-4 h-4 text-indigo-500" />
           <span className="text-sm font-bold text-indigo-700">{filteredComplaints.length} Records Found</span>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            id="complaints-search"
            name="search"
            type="text"
            placeholder="Search by ID or Road Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <select 
          id="complaints-status"
          name="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select 
          id="complaints-severity"
          name="severity"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select 
          id="complaints-area"
          name="area"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        >
           <option value="all">All Areas</option>
           {SURAT_AREAS.map((a: string) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pothole ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Severity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((c) => (
                <motion.tr 
                  layout
                  key={c.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedPotholeId(c.id)}
                >
                  <td className="px-6 py-4">
                    <span className="font-black text-navy-900">{c.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-900">{c.roadName}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{c.zone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      c.severity === 'critical' ? 'bg-red-500 text-white' :
                      c.severity === 'high' ? 'bg-orange-500 text-white' :
                      c.severity === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                      c.status === 'resolved' ? 'text-emerald-600' :
                      c.status === 'assigned' ? 'text-blue-600' : 'text-amber-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        c.status === 'resolved' ? 'bg-emerald-600' :
                        c.status === 'assigned' ? 'bg-blue-600' : 'bg-amber-500 animate-pulse'
                      }`} />
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{new Date(c.timestamp).toLocaleDateString()}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-300 hover:text-navy-900 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PotholeDetailModal 
        pothole={selectedPothole}
        onClose={() => setSelectedPotholeId(null)}
        onResolve={(id) => updatePotholeStatus(id, 'resolved')}
        onInProgress={(id) => updatePotholeStatus(id, 'assigned')}
      />
    </div>
  );
}
