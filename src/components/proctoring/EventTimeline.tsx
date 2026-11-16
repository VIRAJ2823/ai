'use client';

import React from 'react';
import { MonitoringEvent, MonitoringEventType, MonitoringStatus } from '@/lib/types';
import {
  Activity,
  AlertCircle,
  Eye,
  Users,
  Layers,
  HelpCircle,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface EventTimelineProps {
  events: MonitoringEvent[];
  cameraStatus: 'connected' | 'reconnecting' | 'disconnected' | 'alternative_mode';
  sessionStatus: MonitoringStatus | 'paused';
  onChallengeEvent?: (event: MonitoringEvent) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  cameraStatus,
  sessionStatus,
  onChallengeEvent,
}) => {
  const getBadgeConfig = (type: MonitoringEventType) => {
    switch (type) {
      case 'normal_observation':
        return {
          icon: Activity,
          label: 'Normal Observation',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
      case 'attention_required':
        return {
          icon: AlertCircle,
          label: 'Attention Required',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'technical_issue':
        return {
          icon: Wifi,
          label: 'Technical Observation',
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        };
      case 'multiple_face_detected':
        return {
          icon: Users,
          label: 'Multiple Faces',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
      case 'tab_visibility_change':
        return {
          icon: Layers,
          label: 'Tab Visibility Change',
          bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        };
      case 'face_not_detected':
        return {
          icon: Eye,
          label: 'Face Not Detected',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        };
      default:
        return {
          icon: HelpCircle,
          label: 'System Note',
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-lg">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Monitoring Event Timeline</h4>
            <p className="text-[11px] text-slate-400">Neutral chronological stream of environmental and browser events</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
            <span
              className={`w-2 h-2 rounded-full ${
                cameraStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : cameraStatus === 'alternative_mode'
                  ? 'bg-purple-400'
                  : 'bg-rose-400'
              }`}
            />
            <span className="text-slate-300 font-medium">
              Camera: {cameraStatus === 'alternative_mode' ? 'Alternative Mode' : cameraStatus}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium capitalize">
              Session: {sessionStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto max-h-48 pr-1 space-y-2">
        {events.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            No events recorded yet. Environmental conditions are stable.
          </div>
        ) : (
          [...events].reverse().map((evt) => {
            const config = getBadgeConfig(evt.event_type);
            const Icon = config.icon;
            const isClarified = evt.review_status === 'student_clarified';

            return (
              <div
                key={evt.id}
                className="group flex items-start justify-between p-2.5 bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 rounded-xl text-xs transition"
              >
                <div className="flex items-start space-x-2.5">
                  <div className={`p-1.5 rounded-lg border flex-shrink-0 mt-0.5 ${config.bg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{config.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTimestamp(evt.event_timestamp)}
                      </span>
                      {evt.duration_seconds > 0 && (
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded font-mono">
                          {evt.duration_seconds}s
                        </span>
                      )}
                      {isClarified && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5 inline" />
                          <span>Clarified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {evt.event_metadata?.description || evt.event_metadata?.detail || 'Observation recorded.'}
                    </p>
                    {evt.student_challenge_notes && (
                      <p className="text-[11px] text-indigo-300 italic mt-1 bg-indigo-950/40 p-1.5 rounded border border-indigo-900/40">
                        Student Note: "{evt.student_challenge_notes}"
                      </p>
                    )}
                  </div>
                </div>

                {onChallengeEvent && !isClarified && (
                  <button
                    onClick={() => onChallengeEvent(evt)}
                    className="opacity-80 group-hover:opacity-100 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium ml-2 px-2 py-1 rounded hover:bg-indigo-500/10 transition"
                  >
                    Clarify
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
