'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FileCheck2,
  Clock,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { MonitoringSession } from '@/lib/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MonitoringSession[]>([
    {
      id: 'ses_sample_01',
      student_id: user?.id || 'usr_student_01',
      interview_session_id: 'int_mock_fullstack_01',
      camera_permission_status: 'granted',
      started_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      ended_at: new Date(Date.now() - 86400000 * 2 + 18 * 60000).toISOString(),
      monitoring_status: 'completed',
      total_duration_seconds: 1080,
      face_visibility_percentage: 97.4,
      multiple_face_events_count: 0,
      tab_visibility_events_count: 1,
      face_not_detected_duration_seconds: 12,
      technical_issues_count: 0,
      summary_notes: 'Standard interview environment conditions. 1 tab visibility event clarified by student as opening scratchpad.',
    },
    {
      id: 'ses_sample_02',
      student_id: user?.id || 'usr_student_01',
      interview_session_id: 'int_mock_sysdesign_02',
      camera_permission_status: 'granted',
      started_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      ended_at: new Date(Date.now() - 86400000 * 5 + 24 * 60000).toISOString(),
      monitoring_status: 'completed',
      total_duration_seconds: 1440,
      face_visibility_percentage: 95.8,
      multiple_face_events_count: 1,
      tab_visibility_events_count: 2,
      face_not_detected_duration_seconds: 18,
      technical_issues_count: 0,
      summary_notes: '1 multiple-face observation (roommate walked by), clarified with attached context note.',
    },
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            Verified Integrity Audits
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Interview Sessions & Environmental Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Complete audit trail of your Module 13 proctored mock interview sessions. All observations are transparent and reviewable.
          </p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Interview</span>
        </Link>
      </div>

      <div className="space-y-4">
        {sessions.map((ses) => (
          <div
            key={ses.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-lg transition space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Session: <span className="font-mono text-indigo-400">{ses.id}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Conducted on {new Date(ses.started_at).toLocaleDateString()} at{' '}
                    {new Date(ses.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                  Status: Completed
                </span>
                <Link
                  href={`/report/${ses.id}`}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Duration</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {Math.round((ses.total_duration_seconds || 0) / 60)} minutes
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Face Visibility</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {ses.face_visibility_percentage}%
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tab Switches</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {ses.tab_visibility_events_count}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Multiple Faces</span>
                <span className="text-sm font-bold text-purple-400 font-mono">
                  {ses.multiple_face_events_count}
                </span>
              </div>
            </div>

            {ses.summary_notes && (
              <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                Summary: "{ses.summary_notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
