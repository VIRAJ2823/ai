'use client';

import React, { useState } from 'react';
import { FullInterviewReport, MonitoringEvent } from '@/lib/types';
import {
  ShieldCheck,
  Award,
  Eye,
  Users,
  Layers,
  Clock,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  MessageSquare,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ChallengeModal } from '../proctoring/ChallengeModal';

interface CombinedInterviewReportProps {
  report: FullInterviewReport;
  onRetake: () => void;
}

export const CombinedInterviewReport: React.FC<CombinedInterviewReportProps> = ({
  report,
  onRetake,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'performance' | 'integrity'>('all');
  const [selectedChallengeEvent, setSelectedChallengeEvent] = useState<MonitoringEvent | null>(null);
  const [localEvents, setLocalEvents] = useState<MonitoringEvent[]>(report.events);

  const { session, integritySummary, performanceSummary, answers } = report;

  const handleChallengeSuccess = (eventId: string, notes: string) => {
    setLocalEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, review_status: 'student_clarified', student_challenge_notes: notes }
          : e
      )
    );
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `interview_report_${session.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-8 px-4 text-slate-100">
      {/* Top Banner & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
              Official Assessment Summary
            </span>
            <span className="text-xs text-slate-400">
              Session ID: <strong className="font-mono text-slate-200">{session.id}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Mock Interview & Environmental Integrity Report
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Integrated evaluation combining candidate technical competency with transparent, privacy-first environmental observations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center space-x-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Session</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'all'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Unified Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'performance'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Section A: Interview Performance
        </button>
        <button
          onClick={() => setActiveTab('integrity')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'integrity'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Section B: Environmental Observations
        </button>
      </div>

      {/* SECTION A: PERFORMANCE OVERVIEW CARDS */}
      {(activeTab === 'all' || activeTab === 'performance') && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-bold text-slate-100">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2>Section A: Candidate Interview Performance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Overall Performance
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-indigo-400">
                  {performanceSummary.overallPerformanceScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Weighted composite score across technical, communication, and problem-solving criteria.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Technical Knowledge
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-emerald-400">
                  {performanceSummary.technicalKnowledgeAvg}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Concept accuracy, architectural depth, and domain vocabulary.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Communication Clarity
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-sky-400">
                  {performanceSummary.communicationAvg}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Structure, conciseness, and articulation of complex ideas.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Problem Solving
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-purple-400">
                  {performanceSummary.problemSolvingAvg}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Trade-off balancing, edge-case analysis, and structured logic.
              </p>
            </div>
          </div>

          {/* Answer Breakdown */}
          {answers.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-slate-200">
                Detailed Answer Evaluation ({answers.length} Questions Answered)
              </h3>
              <div className="space-y-4">
                {answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-semibold text-[10px]">
                          {ans.category}
                        </span>
                        <h4 className="font-semibold text-slate-100 text-sm mt-1">
                          {ans.questionText}
                        </h4>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-base font-bold text-indigo-400">
                          {ans.evaluation.overallScore}/100
                        </span>
                        <span className="block text-[10px] text-slate-400">AI Score</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300">
                      <strong className="text-slate-400 block mb-1">Candidate Answer:</strong>
                      <p className="italic">{ans.userAnswer}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                        <span className="text-emerald-400 font-semibold block mb-1">Key Strengths:</span>
                        <ul className="space-y-0.5 text-slate-300">
                          {ans.evaluation.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                        <span className="text-amber-400 font-semibold block mb-1">Growth Suggestions:</span>
                        <ul className="space-y-0.5 text-slate-300">
                          {ans.evaluation.improvements.map((imp, i) => (
                            <li key={i}>• {imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION B: ENVIRONMENTAL OBSERVATIONS */}
      {(activeTab === 'all' || activeTab === 'integrity') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-2 text-lg font-bold text-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2>Section B: Interview Environment Observations</h2>
          </div>

          {/* Environmental Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Duration</span>
              <span className="text-lg font-bold text-white font-mono">
                {formatDuration(integritySummary.totalDurationSeconds)}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <Eye className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Face Visibility</span>
              <span className="text-lg font-bold text-emerald-400">
                {integritySummary.faceVisibilityPercentage}%
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Multiple Faces</span>
              <span className="text-lg font-bold text-purple-400">
                {integritySummary.multipleFaceCount}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <Layers className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tab Switches</span>
              <span className="text-lg font-bold text-amber-400">
                {integritySummary.tabVisibilityChangesCount}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <Activity className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Face Absent</span>
              <span className="text-lg font-bold text-rose-400 font-mono">
                {integritySummary.faceNotDetectedDurationSeconds}s
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-center">
              <ShieldCheck className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Camera Uptime</span>
              <span className="text-lg font-bold text-sky-400">
                {integritySummary.cameraAvailabilityPercentage}%
              </span>
            </div>
          </div>

          {/* Neutral Summary Banner */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs">
            <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-200">Environmental Summary (Objective & Neutral):</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                {integritySummary.overallEnvironmentalSummary}
              </p>
              <p className="text-[11px] text-slate-500 mt-2 italic">
                * Note: Environmental observations do not constitute a judgment of dishonesty or cheating probability. Candidates have full rights to explain or challenge any logged observation below.
              </p>
            </div>
          </div>

          {/* Interactive Event Timeline Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Individual Observation Logs ({localEvents.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Click "Explain Observation" to append your context to any item for reviewer consideration.
                </p>
              </div>
            </div>

            {localEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No observations were logged during this session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Observation Type</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Context & Details</th>
                      <th className="p-3">Review Status</th>
                      <th className="p-3 text-right">Student Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {localEvents.map((evt) => {
                      const isClarified = evt.review_status === 'student_clarified';
                      return (
                        <tr key={evt.id} className="hover:bg-slate-950/40 transition">
                          <td className="p-3 font-semibold text-slate-200 capitalize">
                            {evt.event_type.replace(/_/g, ' ')}
                          </td>
                          <td className="p-3 font-mono text-slate-400">
                            {new Date(evt.event_timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-3 font-mono">
                            {evt.duration_seconds > 0 ? `${evt.duration_seconds}s` : '—'}
                          </td>
                          <td className="p-3 max-w-xs">
                            <p>{evt.event_metadata?.description || evt.event_metadata?.detail || 'Observation recorded'}</p>
                            {evt.student_challenge_notes && (
                              <p className="mt-1 text-indigo-300 italic bg-indigo-950/40 p-1.5 rounded border border-indigo-900/40">
                                Candidate Note: "{evt.student_challenge_notes}"
                              </p>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                isClarified
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {isClarified ? 'Clarified' : 'Recorded'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {!isClarified ? (
                              <button
                                onClick={() => setSelectedChallengeEvent(evt)}
                                className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-medium transition"
                              >
                                Explain Observation
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-400 flex items-center justify-end space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Note Attached</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      <ChallengeModal
        event={selectedChallengeEvent}
        isOpen={Boolean(selectedChallengeEvent)}
        onClose={() => setSelectedChallengeEvent(null)}
        onSuccess={handleChallengeSuccess}
      />
    </div>
  );
};
