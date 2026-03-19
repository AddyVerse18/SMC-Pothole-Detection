import { MOCK_POTHOLES } from '../../data/mockData';
import { AlertTriangle, Activity, Cpu, TrendingUp } from 'lucide-react';

export default function KpiHeader() {
  const today = MOCK_POTHOLES.length; // mock: all are "today"
  const critical = MOCK_POTHOLES.filter((p) => p.severity === 'critical').length;
  const activeDevices = [...new Set(MOCK_POTHOLES.map((p) => p.deviceId))].length;
  const avgConfidence = Math.round(
    MOCK_POTHOLES.reduce((sum, p) => sum + p.confidence, 0) / MOCK_POTHOLES.length
  );

  const tiles = [
    {
      id: 'total',
      label: 'Total Detections',
      sublabel: 'Today',
      value: today,
      icon: Activity,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      valueColor: 'text-navy-900',
      trend: '+3 vs yesterday',
      trendUp: true,
    },
    {
      id: 'critical',
      label: 'Critical Spots',
      sublabel: 'Pending action',
      value: critical,
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-600',
      trend: 'Requires immediate attention',
      trendUp: false,
    },
    {
      id: 'devices',
      label: 'Active Devices',
      sublabel: 'IoT sensors online',
      value: activeDevices,
      icon: Cpu,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-600',
      trend: 'All units reporting',
      trendUp: true,
    },
    {
      id: 'confidence',
      label: 'Avg. Confidence',
      sublabel: 'Detection accuracy',
      value: `${avgConfidence}%`,
      icon: TrendingUp,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      valueColor: 'text-navy-900',
      trend: 'Model v3.1',
      trendUp: true,
    },
  ];

  return (
    <div className="flex gap-3 px-4 pt-4 pb-0">
      {tiles.map((tile) => (
        <div key={tile.id} className="kpi-tile animate-fade-in">
          {/* Icon */}
          <div className={`w-10 h-10 ${tile.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <tile.icon className={`w-5 h-5 ${tile.iconColor}`} strokeWidth={1.75} />
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className="text-slate-500 text-xs font-medium leading-tight truncate">{tile.label}</p>
            <p className={`text-2xl font-bold tracking-tight leading-tight ${tile.valueColor}`}>
              {tile.value}
            </p>
            <p className={`text-[11px] mt-0.5 truncate ${tile.trendUp ? 'text-slate-400' : 'text-red-400'}`}>
              {tile.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
