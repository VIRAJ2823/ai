'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Camera,
  Eye,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  StopCircle,
  Users,
  Settings2,
} from 'lucide-react';
import { VisionDetectionResult } from '@/lib/vision/visionDetector';
import { HeadPoseIndicator } from './HeadPoseIndicator';

interface WebcamProctorViewProps {
  stream: MediaStream | null;
  detectionResult: VisionDetectionResult | null;
  elapsedSeconds: number;
  cameraStatus: 'connected' | 'reconnecting' | 'disconnected' | 'alternative_mode';
  onStopMonitoring: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const WebcamProctorView: React.FC<WebcamProctorViewProps> = ({
  stream,
  detectionResult,
  elapsedSeconds,
  cameraStatus,
  onStopMonitoring,
  onOpenPrivacyPolicy,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showOverlays, setShowOverlays] = useState(true);

  // Hook stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  // Draw overlay bounding box and directional guide
  useEffect(() => {
    if (!showOverlays || !canvasRef.current || !videoRef.current || !detectionResult) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (detectionResult.faceDetected && detectionResult.boundingBox) {
      const box = detectionResult.boundingBox;
      // Flip X because video is mirrored
      const scaleX = w / 640;
      const scaleY = h / 480;

      const drawX = (640 - (box.x + box.width)) * scaleX;
      const drawY = box.y * scaleY;
      const drawW = box.width * scaleX;
      const drawH = box.height * scaleY;

      // Draw bounding box
      ctx.strokeStyle = detectionResult.faceCount > 1 ? '#a855f7' : '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX, drawY, drawW, drawH);

      // Corner accents
      const cornerSize = 12;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(drawX, drawY + cornerSize);
      ctx.lineTo(drawX, drawY);
      ctx.lineTo(drawX + cornerSize, drawY);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(drawX + drawW - cornerSize, drawY);
      ctx.lineTo(drawX + drawW, drawY);
      ctx.lineTo(drawX + drawW, drawY + cornerSize);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(drawX, drawY + drawH - cornerSize);
      ctx.lineTo(drawX, drawY + drawH);
      ctx.lineTo(drawX + cornerSize, drawY + drawH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(drawX + drawW - cornerSize, drawY + drawH);
      ctx.lineTo(drawX + drawW, drawY + drawH);
      ctx.lineTo(drawX + drawW, drawY + drawH - cornerSize);
      ctx.stroke();

      // Draw Head Direction Pointer Vector
      const cx = drawX + drawW / 2;
      const cy = drawY + drawH / 2;
      const dirX = cx - detectionResult.headOrientation.yaw * 1.5;
      const dirY = cy + detectionResult.headOrientation.pitch * 1.2;

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(dirX, dirY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(dirX, dirY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }
  }, [detectionResult, showOverlays]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isAlternative = cameraStatus === 'alternative_mode';

  return (
    <div className="flex flex-col space-y-4">
      {/* Video Preview Card */}
      <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
        {!isAlternative ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-950">
            <Shield className="w-12 h-12 text-purple-400 mb-2" />
            <h4 className="text-sm font-semibold text-slate-200">Alternative Assessment Mode</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Webcam monitoring is disabled for this session. Tab switches and interview timers remain active.
            </p>
          </div>
        )}

        {/* Live Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-full border border-slate-700/80 text-[11px] text-white flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  cameraStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : cameraStatus === 'alternative_mode'
                    ? 'bg-purple-400'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-medium">
                {isAlternative ? 'Alternative Mode' : 'AI Proctor Active'}
              </span>
            </div>

            {!isAlternative && detectionResult && (
              <div
                className={`px-2 py-1 rounded-full backdrop-blur-md border text-[10px] font-semibold flex items-center space-x-1 ${
                  detectionResult.faceCount === 1
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : detectionResult.faceCount > 1
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {detectionResult.faceCount === 1 ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>1 Face Visible</span>
                  </>
                ) : detectionResult.faceCount > 1 ? (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Multiple Faces ({detectionResult.faceCount})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Face Absent</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              title="Toggle AI Landmarker & Vector Overlay"
              className="p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-slate-700 text-slate-300 hover:text-white transition"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Session Timer Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs font-mono font-bold text-indigo-300 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-lg border border-slate-700 text-[10px] text-slate-400">
            Local AI Engine
          </div>
        </div>
      </div>

      {/* Head Pose & Gaze Analysis Card */}
      {!isAlternative && detectionResult && (
        <HeadPoseIndicator
          orientation={detectionResult.headOrientation}
          gaze={detectionResult.gazeDirection}
          lightingCondition={detectionResult.lightingCondition}
          luminance={detectionResult.luminance}
        />
      )}

      {/* Control Buttons & Privacy Safeguards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
        <button
          onClick={onOpenPrivacyPolicy}
          className="text-slate-400 hover:text-slate-200 flex items-center space-x-1.5"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Privacy Rights</span>
        </button>

        <button
          onClick={onStopMonitoring}
          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20 font-medium flex items-center space-x-1.5 transition"
        >
          <StopCircle className="w-3.5 h-3.5" />
          <span>Stop Monitoring</span>
        </button>
      </div>
    </div>
  );
};
