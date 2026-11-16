'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FullInterviewReport } from '@/lib/types';
import { CombinedInterviewReport } from '@/components/report/CombinedInterviewReport';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function SessionReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [report, setReport] = useState<FullInterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/interview/report/${sessionId}`);
        if (!res.ok) {
          throw new Error('Interview report could not be found or has expired.');
        }
        const data = await res.json();
        setReport(data.report);
      } catch (err: any) {
        setError(err.message || 'Error loading report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm">Loading Interview Integrity and Performance Report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300 space-y-4">
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error || 'Report not found'}</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
        >
          Return to Interview Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6">
      <CombinedInterviewReport report={report} onRetake={() => router.push('/')} />
    </div>
  );
}
