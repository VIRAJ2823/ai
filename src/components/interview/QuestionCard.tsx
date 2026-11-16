'use client';

import React, { useState } from 'react';
import { InterviewQuestion } from '@/lib/types';
import { HelpCircle, Volume2, Sparkles, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold">
            {question.category}
          </span>
          <span className="text-xs text-slate-400">
            Suggested: ~{question.suggestedDurationMinutes} mins
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Question Text */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-100 leading-relaxed">
            {question.question}
          </h3>
          <button
            onClick={handleSpeak}
            title={isPlayingAudio ? 'Stop reading' : 'Read question aloud'}
            className={`p-2 rounded-xl border transition flex-shrink-0 ${
              isPlayingAudio
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hint & Rubric Dropdown */}
      <div className="pt-2 border-t border-slate-800/60">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center space-x-1.5 transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showHint ? 'Hide hints & expected criteria' : 'View hints & expected criteria'}</span>
          {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showHint && (
          <div className="mt-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 text-xs">
            <p className="text-slate-300 italic">
              <strong className="text-indigo-400 not-italic">Hint: </strong>
              {question.hint}
            </p>
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Expected Key Points:
              </span>
              <ul className="space-y-1 text-slate-400">
                {question.expectedCriteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
