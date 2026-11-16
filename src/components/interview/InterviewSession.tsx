'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CameraPermissionStatus,
  MonitoringEvent,
  MonitoringEventType,
  MonitoringSession,
  VisionDetectionResult,
  FullInterviewReport,
  AnswerEvaluation,
} from '@/lib/types';
import { INTERVIEW_QUESTIONS } from '@/lib/interviewQuestions';
import { ClientVisionEngine } from '@/lib/vision/visionDetector';
import { BrowserActivityMonitor } from '@/lib/vision/browserMonitor';
import { CameraSetupModal } from '../proctoring/CameraSetupModal';
import { WebcamProctorView } from '../proctoring/WebcamProctorView';
import { QuestionCard } from './QuestionCard';
import { AnswerInput } from './AnswerInput';
import { EventTimeline } from '../proctoring/EventTimeline';
import { PrivacyPolicyModal } from '../proctoring/PrivacyPolicyModal';
import { CombinedInterviewReport } from '../report/CombinedInterviewReport';
import { ChallengeModal } from '../proctoring/ChallengeModal';
import { AlertCircle, Bell, ShieldAlert, Sparkles, X } from 'lucide-react';

export const InterviewSession: React.FC = () => {
  // Session state
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>('pending');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fullReport, setFullReport] = useState<FullInterviewReport | null>(null);

  // Stream & Detection state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [detectionResult, setDetectionResult] = useState<VisionDetectionResult | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'connected' | 'reconnecting' | 'disconnected' | 'alternative_mode'>('connected');

  // Timer & Questions state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null);

  // Events & Notifications state
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [activeTabNotification, setActiveTabNotification] = useState<string | null>(null);
  const [selectedChallengeEvent, setSelectedChallengeEvent] = useState<MonitoringEvent | null>(null);

  // Refs
  const visionEngineRef = useRef<ClientVisionEngine | null>(null);
  const browserMonitorRef = useRef<BrowserActivityMonitor | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>('');

  // 1. Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const generatedId = 'ses_' + Math.random().toString(36).substring(2, 11);
      sessionIdRef.current = generatedId;

      try {
        const res = await fetch('/api/monitoring/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: generatedId,
            student_id: 'candidate_' + Math.random().toString(36).substring(2, 7),
            interview_session_id: 'mock_int_' + Math.random().toString(36).substring(2, 7),
            camera_permission_status: 'pending',
            monitoring_status: 'active',
          }),
        });
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
        }
      } catch (err) {
        console.error('Failed to init session on server:', err);
      }
    };

    initSession();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (visionEngineRef.current) visionEngineRef.current.stop();
      if (browserMonitorRef.current) browserMonitorRef.current.stop();
    };
  }, []);

  // 2. Start timer when setup is completed
  useEffect(() => {
    if (permissionStatus !== 'pending' && !isCompleted) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [permissionStatus, isCompleted]);

  // 3. Centralized Event Logger
  const logEvent = async (
    type: MonitoringEventType,
    durationSeconds: number,
    metadata: Record<string, any>
  ) => {
    const sId = sessionIdRef.current;
    if (!sId) return;

    const eventPayload: Omit<MonitoringEvent, 'id' | 'event_timestamp'> = {
      monitoring_session_id: sId,
      event_type: type,
      duration_seconds: durationSeconds,
      event_metadata: metadata,
      review_status: 'pending',
    };

    const tempEvent: MonitoringEvent = {
      ...eventPayload,
      id: 'evt_' + Math.random().toString(36).substring(2, 11),
      event_timestamp: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, tempEvent]);

    try {
      await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      });
    } catch (err) {
      console.error('Failed to push event to server:', err);
    }
  };

  // 4. Setup Camera Permission Handlers
  const handlePermissionGranted = (stream: MediaStream) => {
    setMediaStream(stream);
    setPermissionStatus('granted');
    setCameraStatus('connected');
    setIsSetupModalOpen(false);

    // Update session on server
    if (sessionIdRef.current) {
      fetch('/api/monitoring/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionIdRef.current,
          camera_permission_status: 'granted',
        }),
      });
    }

    // Initialize Vision Engine for ongoing monitoring
    const tempVideo = document.createElement('video');
    tempVideo.autoplay = true;
    tempVideo.playsInline = true;
    tempVideo.muted = true;
    tempVideo.srcObject = stream;
    tempVideo.play().catch(console.error);

    const engine = new ClientVisionEngine();
    engine.setVideoElement(tempVideo);
    engine.onResult = (res) => {
      setDetectionResult(res);
    };
    engine.onEventTriggered = (type, duration, metadata) => {
      logEvent(type, duration, metadata);
    };
    engine.start();
    visionEngineRef.current = engine;

    // Initialize Browser Activity Monitor
    initBrowserMonitor();

    // Log initial normal observation
    logEvent('normal_observation', 0, {
      description: 'Camera monitoring activated with student consent',
      detail: 'Local computer vision running inside client browser',
    });
  };

  const handleAlternativeMode = () => {
    setPermissionStatus('alternative_mode');
    setCameraStatus('alternative_mode');
    setIsSetupModalOpen(false);

    if (sessionIdRef.current) {
      fetch('/api/monitoring/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionIdRef.current,
          camera_permission_status: 'alternative_mode',
          monitoring_status: 'alternative_mode',
        }),
      });
    }

    initBrowserMonitor();

    logEvent('normal_observation', 0, {
      description: 'Alternative Assessment Mode selected by student',
      detail: 'Webcam observation disabled; browser tab monitoring active',
    });
  };

  const initBrowserMonitor = () => {
    const monitor = new BrowserActivityMonitor({
      onTabHidden: () => {
        setActiveTabNotification('Notice: The interview tab was switched or minimized.');
      },
      onTabVisible: (duration) => {
        setActiveTabNotification(`Returned to interview tab (switched away for ${duration}s).`);
        setTimeout(() => setActiveTabNotification(null), 6000);
      },
      onEvent: (type, duration, metadata) => {
        logEvent(type, duration, metadata);
      },
    });
    monitor.start();
    browserMonitorRef.current = monitor;
  };

  // 5. Answer Submission Flow
  const handleAnswerSubmit = async (answer: string) => {
    const currentQ = INTERVIEW_QUESTIONS[currentQuestionIndex];
    if (!currentQ || !sessionIdRef.current) return;

    setIsSubmittingAnswer(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          questionId: currentQ.id,
          questionText: currentQ.question,
          category: currentQ.category,
          userAnswer: answer,
        }),
      });

      const data = await res.json();
      if (data.record?.evaluation) {
        setLastEvaluation(data.record.evaluation);
      }

      // Check if more questions remain
      if (currentQuestionIndex + 1 < INTERVIEW_QUESTIONS.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Complete interview
        await completeInterview();
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // 6. Complete Interview & Generate Report
  const completeInterview = async () => {
    if (visionEngineRef.current) visionEngineRef.current.stop();
    if (browserMonitorRef.current) browserMonitorRef.current.stop();
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
    }

    try {
      // Patch session to completed
      await fetch('/api/monitoring/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionIdRef.current,
          ended_at: new Date().toISOString(),
          monitoring_status: 'completed',
        }),
      });

      // Fetch combined report
      const repRes = await fetch(`/api/interview/report/${sessionIdRef.current}`);
      const repData = await repRes.json();
      if (repData.report) {
        setFullReport(repData.report);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    }

    setIsCompleted(true);
  };

  // 7. Stop Monitoring Early Safeguard
  const handleStopMonitoring = () => {
    if (confirm('Are you sure you want to stop camera monitoring? You can continue in Alternative Mode.')) {
      if (visionEngineRef.current) visionEngineRef.current.stop();
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      setCameraStatus('alternative_mode');
      logEvent('normal_observation', 0, {
        description: 'Camera monitoring paused by student',
        detail: 'Session converted to Alternative Mode without webcam',
      });
    }
  };

  const handleRetake = () => {
    window.location.reload();
  };

  if (isCompleted && fullReport) {
    return <CombinedInterviewReport report={fullReport} onRetake={handleRetake} />;
  }

  const currentQ = INTERVIEW_QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Tab Switch Notification Toast */}
      {activeTabNotification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-amber-950/90 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between text-xs animate-bounce">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{activeTabNotification}</span>
          </div>
          <button
            onClick={() => setActiveTabNotification(null)}
            className="p-1 hover:bg-amber-900/50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:px-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>AI Mock Interview Environment</span>
                <span className="text-[11px] font-normal text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800">
                  Module 13
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                AI Proctoring & Transparent Camera Monitoring Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-slate-700 text-xs font-medium transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={completeInterview}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
            >
              Finish Interview
            </button>
          </div>
        </div>

        {/* 3-Section Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SECTION (Webcam, Face Status, Session Timer) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <WebcamProctorView
              stream={mediaStream}
              detectionResult={detectionResult}
              elapsedSeconds={elapsedSeconds}
              cameraStatus={cameraStatus}
              onStopMonitoring={handleStopMonitoring}
              onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
            />
          </div>

          {/* RIGHT SECTION (Question, Answer input, Submit, Progress) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <QuestionCard
              question={currentQ}
              currentIndex={currentQuestionIndex}
              totalQuestions={INTERVIEW_QUESTIONS.length}
            />

            <AnswerInput
              onSubmitAnswer={handleAnswerSubmit}
              isSubmitting={isSubmittingAnswer}
              lastEvaluation={lastEvaluation}
            />
          </div>
        </div>

        {/* BOTTOM SECTION (Monitoring Event Timeline & System Connection Status) */}
        <div className="w-full">
          <EventTimeline
            events={events}
            cameraStatus={cameraStatus}
            sessionStatus={session?.monitoring_status || 'active'}
            onChallengeEvent={(evt) => setSelectedChallengeEvent(evt)}
          />
        </div>
      </div>

      {/* Pre-interview Setup Modal */}
      <CameraSetupModal
        isOpen={isSetupModalOpen}
        onPermissionGranted={handlePermissionGranted}
        onAlternativeModeSelected={handleAlternativeMode}
        onCancel={() => {
          setIsSetupModalOpen(false);
          handleAlternativeMode();
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Challenge / Clarify Modal */}
      <ChallengeModal
        event={selectedChallengeEvent}
        isOpen={Boolean(selectedChallengeEvent)}
        onClose={() => setSelectedChallengeEvent(null)}
        onSuccess={(eventId, notes) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === eventId
                ? { ...e, review_status: 'student_clarified', student_challenge_notes: notes }
                : e
            )
          );
        }}
      />
    </div>
  );
};
