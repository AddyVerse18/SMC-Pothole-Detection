import { useDashboard, SMCZone } from '../../context/DashboardContext';
import { MapPin, Bell, User } from 'lucide-react';

export default function Header() {
  const { selectedZone, setSelectedZone } = useDashboard();

  const zones: SMCZone[] = ['All Zones', 'Athwa', 'Varachha', 'Limbayat', 'Katargam', 'Adajan'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-navy-900 hidden md:block">
          SMC <span className="text-blue-600">Road Ops</span>
        </h1>
        <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
        
        {/* Zone Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <MapPin size={16} className="text-blue-600" />
          <select 
            id="header-zone-selector"
            name="zone-selector"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value as SMCZone)}
            className="bg-transparent text-sm font-semibold text-navy-800 focus:outline-none cursor-pointer pr-2"
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-navy-900 leading-none">Admin User</p>
            <p className="text-xs text-slate-500 mt-1">SMC Commissioner Office</p>
          </div>
          <div className="w-9 h-9 bg-navy-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
