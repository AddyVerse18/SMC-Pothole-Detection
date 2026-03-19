import { NavLink, useNavigate } from 'react-router-dom';
import { Map, FlameKindling, Cpu, Settings, Shield, LogOut } from 'lucide-react';

const navItems = [
  { id: 'map',      label: 'Live Map',       icon: Map,           path: '/dashboard',          end: true },
  { id: 'heatmaps', label: 'Heatmaps',       icon: FlameKindling, path: '/dashboard/heatmaps', end: false },
  { id: 'devices',  label: 'Device Status',  icon: Cpu,           path: '/dashboard/devices',  end: false },
  { id: 'admin',    label: 'Admin Settings', icon: Settings,      path: '/dashboard/admin',    end: false },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="md:sidebar w-full md:w-[60px] h-[60px] md:h-full bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col relative group transition-all duration-200 ease-in-out md:hover:w-[220px]">
      {/* Logo (Hidden on mobile for space) */}
      <div className="hidden md:flex items-center gap-3 px-3.5 py-4 border-b border-slate-100 min-h-[60px]">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <div className="overflow-hidden">
          <p className="text-navy-900 font-bold text-sm leading-tight whitespace-nowrap">SMC Command</p>
          <p className="text-indigo-500 text-xs whitespace-nowrap">Road Maintenance</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start px-2 py-1 md:py-3 space-y-0 md:space-y-0.5 overflow-hidden">
        <p className="hidden md:block text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2 whitespace-nowrap overflow-hidden">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.end}
            className={({ isActive }) => 
              isActive 
                ? 'flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-3.5 py-1.5 md:py-2.5 rounded-lg text-navy-900 bg-indigo-50 md:border-l-2 md:border-t-0 border-t-2 md:border-indigo-500 border-indigo-500 font-medium transition-all duration-150 cursor-pointer whitespace-nowrap' 
                : 'flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-3.5 py-1.5 md:py-2.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-all duration-150 cursor-pointer whitespace-nowrap md:border-l-2 md:border-t-0 border-t-2 border-transparent'
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 md:w-5 md:h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="text-[10px] md:text-sm overflow-hidden whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer (Hidden on mobile) */}
      <div className="hidden md:block border-t border-slate-100 px-2 py-3">
        <div className="px-2 py-1.5 mb-1 overflow-hidden">
          <p className="text-navy-900 text-xs font-semibold whitespace-nowrap">SMC-Admin</p>
          <p className="text-slate-400 text-[11px] whitespace-nowrap">Surat Traffic Dept.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="nav-item w-full text-left group/logout"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover/logout:text-red-500 transition-colors" strokeWidth={1.5} />
          <span className="text-sm text-slate-500 group-hover/logout:text-red-500 transition-colors whitespace-nowrap">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
