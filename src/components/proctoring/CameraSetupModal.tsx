'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  Sliders,
  ChevronRight,
  MonitorOff,
  Sparkles,
} from 'lucide-react';
import { ClientVisionEngine, VisionDetectionResult } from '@/lib/vision/visionDetector';

interface CameraSetupModalProps {
  isOpen: boolean;
  onPermissionGranted: (stream: MediaStream) => void;
  onAlternativeModeSelected: () => void;
  onCancel: () => void;
}

export const CameraSetupModal: React.FC<CameraSetupModalProps> = ({
  isOpen,
  onPermissionGranted,
  onAlternativeModeSelected,
  onCancel,
}) => {
  const [step, setStep] = useState<'consent' | 'preview'>('consent');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToLocalProcessing, setAgreedToLocalProcessing] = useState(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);

  const [detectionResult, setDetectionResult] = useState<VisionDetectionResult | null>(null);
  const [cameraInfo, setCameraInfo] = useState<{ resolution: string; label: string }>({
    resolution: 'Detecting...',
    label: 'Standard Webcam',
  });

  const [testsPassed, setTestsPassed] = useState<{
    faceDetected: boolean;
    headMovement: boolean;
    lightingChecked: boolean;
  }>({
    faceDetected: false,
    headMovement: false,
    lightingChecked: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visionEngineRef = useRef<ClientVisionEngine | null>(null);

  useEffect(() => {
    return () => {
      // Clean up stream on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (visionEngineRef.current) {
        visionEngineRef.current.stop();
      }
    };
  }, [stream]);

  const requestCameraAccess = async () => {
    setIsRequestingCamera(true);
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support MediaDevices camera access.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setStream(mediaStream);
      setStep('preview');

      // Query track settings
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setCameraInfo({
          resolution: settings.width && settings.height ? `${settings.width}x${settings.height}` : '720p HD',
          label: videoTrack.label || 'Webcam User Facing',
        });
      }

      // Initialize Vision Engine
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);

          const engine = new ClientVisionEngine();
          engine.setVideoElement(videoRef.current);
          engine.onResult = (res) => {
            setDetectionResult(res);
            setTestsPassed((prev) => ({
              faceDetected: prev.faceDetected || res.faceDetected,
              headMovement: prev.headMovement || (res.faceDetected && Math.abs(res.headOrientation.yaw) > 12),
              lightingChecked: prev.lightingChecked || res.lightingCondition !== 'low',
            }));
          };
          engine.start();
          visionEngineRef.current = engine;
        }
      }, 300);
    } catch (err: any) {
      console.error('Camera permission request denied or failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera permission was denied. Please allow camera access in browser settings or choose Alternative Mode.');
      } else {
        setPermissionError(err.message || 'Unable to access camera device.');
      }
    } finally {
      setIsRequestingCamera(false);
    }
  };

  const handleProceed = () => {
    if (stream) {
      if (visionEngineRef.current) {
        visionEngineRef.current.stop();
      }
      onPermissionGranted(stream);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Interview Proctoring & Camera Setup</h2>
              <p className="text-xs text-slate-400">Step {step === 'consent' ? '1 of 2: Informed Consent' : '2 of 2: Camera Calibration & Test'}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'consent' ? (
          /* STEP 1: INFORMED CONSENT & TRANSPARENCY */
          <div className="space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>What the Camera Will & Will NOT Monitor:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-emerald-400 font-bold block mb-1">✓ What We Observe</span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Presence of single candidate in camera frame</li>
                    <li>• Approximate head orientation & eye gaze</li>
                    <li>• Multiple face detection in room</li>
                    <li>• Browser tab visibility and focus shifts</li>
                  </ul>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-rose-400 font-bold block mb-1">✗ What We NEVER Do</span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• No biometric or identity recognition</li>
                    <li>• No video recorded or uploaded to server</li>
                    <li>• No emotion analysis or honesty assumptions</li>
                    <li>• No access to personal files or history</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
                />
                <span className="text-slate-300">
                  I understand that camera monitoring will be active during this interview session to generate a transparent environmental report.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToLocalProcessing}
                  onChange={(e) => setAgreedToLocalProcessing(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
                />
                <span className="text-slate-300">
                  I acknowledge that all video frames are processed locally in my browser memory without saving continuous footage.
                </span>
              </label>
            </div>

            {permissionError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{permissionError}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onAlternativeModeSelected}
                className="text-xs text-purple-400 hover:text-purple-300 underline flex items-center space-x-1.5"
              >
                <MonitorOff className="w-3.5 h-3.5" />
                <span>No Camera? Switch to Alternative Mode</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  Cancel Session
                </button>
                <button
                  type="button"
                  disabled={!agreedToTerms || !agreedToLocalProcessing || isRequestingCamera}
                  onClick={requestCameraAccess}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg transition"
                >
                  {isRequestingCamera ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Requesting Access...</span>
                    </>
                  ) : (
                    <>
                      <span>Grant Permission & Test Camera</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: LIVE CAMERA PREVIEW, POSITIONING GUIDE & CALIBRATION TEST */
          <div className="space-y-4">
            <div className="relative aspect-video max-h-[300px] w-full bg-black rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />

              {/* Head Positioning Guide Oval Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`w-48 h-60 rounded-[50%] border-2 border-dashed transition-colors duration-300 flex items-center justify-center ${
                    detectionResult?.faceDetected
                      ? 'border-emerald-400/80 bg-emerald-500/5'
                      : 'border-amber-400/80 bg-amber-500/5'
                  }`}
                >
                  <span className="text-[10px] text-white/70 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Position Head Here
                  </span>
                </div>
              </div>

              {/* Live Status Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <div className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full border border-slate-700 text-[11px] text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Camera Active ({cameraInfo.resolution})</span>
                </div>
              </div>

              {/* Face Presence Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border ${
                    detectionResult?.faceDetected
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {detectionResult?.faceDetected ? (
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Face Detected & Calibrated</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No Face Detected — Please Center Your Face</span>
                    </span>
                  )}
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-black/70 border border-slate-700 text-[10px] text-slate-300">
                  Lighting: <strong className="capitalize text-emerald-400">{detectionResult?.lightingCondition || 'optimal'}</strong>
                </div>
              </div>
            </div>

            {/* Calibration Checklist */}
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    testsPassed.faceDetected ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={testsPassed.faceDetected ? 'text-slate-200' : 'text-slate-500'}>
                  1. Face Presence
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    testsPassed.headMovement ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={testsPassed.headMovement ? 'text-slate-200' : 'text-slate-500'}>
                  2. Head Motion Check
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    testsPassed.lightingChecked ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={testsPassed.lightingChecked ? 'text-slate-200' : 'text-slate-500'}>
                  3. Lighting Quality
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('consent')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Consent
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceed}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <span>Start Monitored Interview</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
