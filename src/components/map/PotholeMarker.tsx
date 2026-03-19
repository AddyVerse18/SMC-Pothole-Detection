import { useState } from 'react';
import type { PotholeDetection } from '../../types';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import PotholeInfoWindow from './PotholeInfoWindow';

interface PotholeMarkerProps {
  pothole: PotholeDetection;
  isSelected: boolean;
  onSelect: (pothole: PotholeDetection | null) => void;
}

const SEVERITY_COLORS: Record<PotholeDetection['severity'], string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

function PinIcon({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 40,
        cursor: 'pointer',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
        transform: 'translateY(-20px)',
      }}
    >
      <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" width="32" height="40">
        <path
          d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28C28 5.373 22.627 0 16 0z"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="16" cy="12" r="5" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

export default function PotholeMarker({ pothole, isSelected, onSelect }: PotholeMarkerProps) {
  const color = SEVERITY_COLORS[pothole.severity];

  return (
    <>
      <AdvancedMarker
        position={{ lat: pothole.lat, lng: pothole.lng }}
        onClick={() => onSelect(isSelected ? null : pothole)}
        title={`Pothole #${pothole.id} — ${pothole.severity.toUpperCase()}`}
        zIndex={isSelected ? 10 : 1}
      >
        <div style={{ transform: isSelected ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s' }}>
          <PinIcon color={color} />
        </div>
      </AdvancedMarker>

      {isSelected && (
        <PotholeInfoWindow pothole={pothole} onClose={() => onSelect(null)} />
      )}
    </>
  );
}
