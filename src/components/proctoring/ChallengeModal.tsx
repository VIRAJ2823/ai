'use client';

import React, { useState } from 'react';
import { MonitoringEvent } from '@/lib/types';
import { MessageSquare, AlertCircle, X, Check } from 'lucide-react';

interface ChallengeModalProps {
  event: MonitoringEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (eventId: string, notes: string) => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [challengeNotes, setChallengeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeNotes.trim()) {
      setError('Please provide an explanation or context for this observation.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/monitoring/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: event.monitoring_session_id,
          challengeNotes: challengeNotes.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit explanation.');
      }

      onSuccess(event.id, challengeNotes.trim());
      setChallengeNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Provide Event Clarification</h3>
              <p className="text-xs text-slate-400">Share context to clarify this observation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Observation Details */}
        <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Event: <strong className="text-slate-200 capitalize">{event.event_type.replace(/_/g, ' ')}</strong></span>
            <span>Duration: <strong className="text-slate-200">{event.duration_seconds}s</strong></span>
          </div>
          <p className="text-slate-300 italic">
            "{event.event_metadata?.description || event.event_metadata?.detail || 'Observation recorded by monitoring system'}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Explanation / Context:
            </label>
            <textarea
              value={challengeNotes}
              onChange={(e) => setChallengeNotes(e.target.value)}
              placeholder="e.g., Looking down at scratch paper to write the rate-limiting formula; or family member briefly walked past door."
              className="w-full h-28 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Submit Clarification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
