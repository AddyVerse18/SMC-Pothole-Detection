import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, AlertTriangle, User, Send } from 'lucide-react';
import { SMCZone, SuratArea, SURAT_AREAS, ROADS, ZONES } from '../../data/simulationData';
import { PotholeDetection } from '../../types';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PotholeDetection> & { reporter: string }) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    area: SURAT_AREAS[0] as SuratArea,
    road: ROADS[0],
    severity: 'medium' as PotholeDetection['severity'],
    reporter: '',
    lat: '',
    lng: ''
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-navy-900">Report Pothole</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({
                ...formData,
                zone: pick(ZONES) as any, // Mock zone mapping for simplicity OR let user pick
                timestamp: new Date().toISOString(),
                status: 'pending',
                confidence: 100,
                address: `${formData.road}, ${formData.area}`,
                roadName: formData.road,
                lat: formData.lat ? parseFloat(formData.lat) : 21.14 + Math.random() * 0.1,
                lng: formData.lng ? parseFloat(formData.lng) : 72.74 + Math.random() * 0.1,
              } as any);
              onClose();
            }}
            className="p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Area / Neighborhood</label>
              <select 
                id="manual-area"
                name="area"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value as SuratArea})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                {SURAT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Road Name</label>
              <select 
                id="manual-road"
                name="road"
                value={formData.road}
                onChange={(e) => setFormData({...formData, road: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                {ROADS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Severity</label>
                <select 
                  id="manual-severity"
                  name="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reporter Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    id="manual-reporter"
                    name="reporter"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.reporter}
                    onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Helper for random pick (simplified version of genData.ts version for local use if needed)
function pick(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
