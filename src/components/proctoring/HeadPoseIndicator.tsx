'use client';

import React from 'react';
import { HeadOrientation, GazeDirection } from '@/lib/types';
import { Compass, Eye } from 'lucide-react';

interface HeadPoseIndicatorProps {
  orientation: HeadOrientation;
  gaze: GazeDirection;
  lightingCondition: 'optimal' | 'low' | 'overexposed';
  luminance: number;
}

export const HeadPoseIndicator: React.FC<HeadPoseIndicatorProps> = ({
  orientation,
  gaze,
  lightingCondition,
  luminance,
}) => {
  const isCentered = gaze === 'center';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Head Pose & Gaze</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            isCentered
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {isCentered ? 'Focused' : `Looking ${gaze}`}
        </span>
      </div>

      {/* Angles Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Yaw (Pan)</span>
          <span className={`text-xs font-mono font-bold ${Math.abs(orientation.yaw) > 22 ? 'text-amber-400' : 'text-slate-200'}`}>
            {orientation.yaw > 0 ? `+${orientation.yaw}°` : `${orientation.yaw}°`}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Pitch (Tilt)</span>
          <span className={`text-xs font-mono font-bold ${Math.abs(orientation.pitch) > 20 ? 'text-amber-400' : 'text-slate-200'}`}>
            {orientation.pitch > 0 ? `+${orientation.pitch}°` : `${orientation.pitch}°`}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Lighting</span>
          <span className={`text-xs font-semibold capitalize ${
            lightingCondition === 'optimal'
              ? 'text-emerald-400'
              : lightingCondition === 'low'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}>
            {lightingCondition}
          </span>
        </div>
      </div>

      {/* Visual Reticle */}
      <div className="relative h-10 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden">
        {/* Center Crosshair */}
        <div className="absolute w-3 h-3 border border-slate-700 rounded-full"></div>
        <div className="absolute w-full h-[1px] bg-slate-800/50"></div>
        <div className="absolute h-full w-[1px] bg-slate-800/50"></div>

        {/* Dynamic Gaze Dot */}
        <div
          className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-150 transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center ${
            isCentered
              ? 'bg-emerald-400 shadow-emerald-500/50'
              : 'bg-amber-400 shadow-amber-500/50'
          }`}
          style={{
            left: `${Math.max(10, Math.min(90, 50 + orientation.yaw * 1.1))}%`,
            top: `${Math.max(10, Math.min(90, 50 + orientation.pitch * 1.1))}%`,
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
