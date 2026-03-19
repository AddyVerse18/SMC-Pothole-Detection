import { useEffect, useState } from 'react';
import { Cpu, Wifi, WifiOff, Battery, Satellite, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { IoTDeviceHealth } from '../types/iot';

export default function DeviceStatusPage() {
  const [devices, setDevices] = useState<IoTDeviceHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchDevices = async () => {
      try {
        const data = await api.getDeviceStatus();
        if (mounted) {
          setDevices(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch device health:', err);
        if (mounted) setLoading(false);
      }
    };

    fetchDevices();
    // Poll every 5s just like the main dashboard
    const interval = setInterval(fetchDevices, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const onlineCount = devices.filter((d) => d.status === 'online').length;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-slate-100 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Cpu className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-navy-900 font-bold text-lg md:text-xl">Hardware Health</h2>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5">{devices.length} RPi Zero 2 W units registered</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
            <Activity className="w-3.5 h-3.5" /> Live Sync Active
          </div>
        </div>

        {/* Mobile quick stats */}
        <div className="md:hidden flex gap-3 mb-5">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center">
            <p className="text-2xl font-bold text-emerald-600 leading-none">{onlineCount}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">Online</p>
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center">
            <p className="text-2xl font-bold text-slate-400 leading-none">{devices.length - onlineCount}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">Offline</p>
          </div>
        </div>

        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
          <div className="col-span-3">Unit ID</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">CPU Temp</div>
          <div className="col-span-2 text-center">NEO-6M Satellites</div>
          <div className="col-span-2 text-center">Battery</div>
          <div className="col-span-1 text-right text-slate-400">Action</div>
        </div>

        {/* Device List */}
        <div className="grid gap-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Polling fleet status...</span>
            </div>
          ) : (
            devices.map((device) => {
              const isOnline = device.status === 'online';

              return (
                <div key={device.device_id} className="card p-3 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center hover:shadow-card-hover transition-shadow group">
                  {/* Mobile Row 1 / Desktop Col 1 */}
                  <div className="col-span-1 md:col-span-3 flex items-center gap-3 md:gap-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isOnline ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                      <Cpu className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-navy-900 font-semibold text-sm truncate">{device.device_id}</p>
                      <p className="text-slate-500 text-[10px] md:text-xs mt-0.5 truncate hidden md:block">Raspberry Pi Zero 2 W</p>
                    </div>
                    {/* Mobile only status badge */}
                    <div className="md:hidden ml-auto flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Status Col */}
                  <div className="hidden md:flex col-span-2 justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>

                  {/* Stats Grid (Mobile Row 2 / Desktop Cols) */}
                  <div className="col-span-1 md:contents grid grid-cols-3 gap-2 mt-1">
                    
                    {/* CPU Temp */}
                    <div className="md:col-span-2 flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg">
                      <Activity className={`w-3.5 h-3.5 ${device.cpu_temp && device.cpu_temp > 65 ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className="font-mono">
                        {isOnline ? `${device.cpu_temp}°C` : '--'}
                      </span>
                    </div>

                    {/* GPS Fix */}
                    <div className="md:col-span-2 flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg">
                      <Satellite className={`w-3.5 h-3.5 ${device.gps_satellites > 3 ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span className="font-mono">
                        {isOnline ? `${device.gps_satellites} Sats` : '--'}
                      </span>
                    </div>

                    {/* Battery */}
                    <div className="md:col-span-2 flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg">
                      <Battery className={`w-3.5 h-3.5 ${device.battery_level < 20 ? 'text-red-500' : 'text-emerald-500'}`} />
                      <span className="font-mono">
                        {device.battery_level}%
                      </span>
                    </div>

                  </div>

                  {/* Actions Desktop */}
                  <div className="hidden md:flex col-span-1 justify-end">
                    <button className="text-indigo-600 text-xs font-semibold hover:text-indigo-800 hover:underline px-2 py-1 transition-colors">
                      Ping
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
