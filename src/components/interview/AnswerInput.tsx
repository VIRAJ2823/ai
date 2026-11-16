'use client';

import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnswerEvaluation } from '@/lib/types';

interface AnswerInputProps {
  onSubmitAnswer: (answer: string) => Promise<void>;
  isSubmitting: boolean;
  lastEvaluation?: AnswerEvaluation | null;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmitAnswer,
  isSubmitting,
  lastEvaluation,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setAnswerText((prev) => prev + ' ' + transcript);
        };

        reco.onerror = () => setIsRecording(false);
        reco.onend = () => setIsRecording(false);

        setRecognition(reco);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech-to-text is not supported on this browser. You can type directly.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmitting) return;

    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    await onSubmitAnswer(answerText.trim());
    setAnswerText('');
  };

  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header and Voice Dictation */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          Your Response:
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition ${
              isRecording
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isRecording ? 'Listening...' : 'Voice Dictation'}</span>
          </button>
        </div>
      </div>

      {/* Textarea */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your structured technical answer here. Mention trade-offs, architecture decisions, and real-world examples..."
            rows={6}
            disabled={isSubmitting}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition leading-relaxed resize-none"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono">
            {wordCount} words
          </div>
        </div>

        {/* Evaluation Feedback Pill if available */}
        {lastEvaluation && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Last Answer AI Score: {lastEvaluation.overallScore}/100</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Tech: {lastEvaluation.technicalKnowledge} | Comm: {lastEvaluation.communication} | Problem Solving: {lastEvaluation.problemSolving}
              </span>
            </div>
            <p className="text-slate-300 italic">{lastEvaluation.feedback}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!answerText.trim() || isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Evaluating Response with AI...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
