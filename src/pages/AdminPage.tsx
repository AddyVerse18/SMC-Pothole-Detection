import { Settings, Construction, User, Bell, Shield, Database, Sliders } from 'lucide-react';

const settingSections = [
  { icon: User, label: 'User Management', desc: 'Manage officer accounts and permissions' },
  { icon: Bell, label: 'Alert Thresholds', desc: 'Configure severity escalation rules' },
  { icon: Shield, label: 'Security & Access', desc: 'Two-factor auth and session policies' },
  { icon: Database, label: 'Data Retention', desc: 'Set detection log retention period' },
  { icon: Sliders, label: 'Detection Sensitivity', desc: 'Tune OV3660 detection parameters' },
];

export default function AdminPage() {
  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center shadow-sm">
            <Settings className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-navy-900 font-bold text-xl">Admin Settings</h2>
            <p className="text-slate-500 text-sm mt-0.5">System configuration and management</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full shadow-sm">
            <Construction className="w-3.5 h-3.5" /> Coming Soon
          </span>
        </div>

        <div className="grid gap-3">
          {settingSections.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="card p-4 flex items-center gap-4 opacity-75 backdrop-grayscale-[0.5] hover:opacity-100 transition-opacity cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-navy-900 text-sm font-semibold">{label}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{desc}</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-wide">
                  Locked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
