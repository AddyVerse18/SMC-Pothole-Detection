import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, HardHat, CheckCircle2, AlertCircle, Clock, Navigation } from 'lucide-react';
import { PotholeDetection } from '../../types';

interface PotholeDetailModalProps {
  pothole: PotholeDetection | null;
  onClose: () => void;
  onResolve: (id: string) => void;
  onInProgress: (id: string) => void;
}

export const PotholeDetailModal: React.FC<PotholeDetailModalProps> = ({ 
  pothole, onClose, onResolve, onInProgress 
}) => {
  if (!pothole) return null;

  const getSeverityStyles = (sev: PotholeDetection['severity']) => {
    switch (sev) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-emerald-500 text-white';
    }
  };

  const getStatusLabel = (status: PotholeDetection['status']) => {
    switch (status) {
      case 'pending': return { label: 'Pending Review', color: 'text-amber-600', icon: Clock };
      case 'assigned': return { label: 'In Progress', color: 'text-blue-600', icon: HardHat };
      case 'resolved': return { label: 'Fixed / Repaired', color: 'text-emerald-600', icon: CheckCircle2 };
      default: return { label: 'Reported', color: 'text-slate-600', icon: AlertCircle };
    }
  };

  const StatusIcon = getStatusLabel(pothole.status).icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Status Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getSeverityStyles(pothole.severity)}`}>
                {pothole.severity}
              </span>
              <span className="text-slate-300">|</span>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${getStatusLabel(pothole.status).color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {getStatusLabel(pothole.status).label}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-navy-900 leading-tight">
                {pothole.id}
              </h2>
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                GPS: {pothole.lat.toFixed(4)}, {pothole.lng.toFixed(4)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                </div>
                <p className="text-sm font-bold text-navy-900">{pothole.roadName}</p>
                <p className="text-xs text-slate-500">{pothole.zone} Zone</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported On</span>
                </div>
                <p className="text-sm font-bold text-navy-900">
                  {new Date(pothole.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(pothole.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
               <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Detection Confidence</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-indigo-700">{pothole.confidence}%</span>
                  <span className="text-xs text-indigo-400 mb-1.5 font-medium">via {pothole.deviceId || 'Manual Report'}</span>
                </div>
            </div>

            {/* Actions */}
            {pothole.status !== 'resolved' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {pothole.status === 'pending' && (
                  <button 
                    onClick={() => onInProgress(pothole.id)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100"
                  >
                    <HardHat className="w-4 h-4" />
                    Assign Crew
                  </button>
                )}
                <button 
                  onClick={() => onResolve(pothole.id)}
                  className={`flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-100 ${pothole.status === 'pending' ? 'col-span-1' : 'col-span-2'}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Resolved
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
