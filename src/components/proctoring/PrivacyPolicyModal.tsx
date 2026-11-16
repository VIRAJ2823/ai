'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, X, CheckCircle, Database } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Privacy & Proctoring Transparency Policy</h3>
              <p className="text-xs text-slate-400">Our commitments to student rights, ethics, and data security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-sm text-slate-300">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100">1. 100% Local In-Browser Processing</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your webcam video stream is processed entirely within your device's browser memory via local computer vision models. No continuous video or audio feeds are recorded or uploaded to remote cloud servers.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
            <EyeOff className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100">2. No Biometric Identity Recognition</h4>
              <p className="text-xs text-slate-400 mt-1">
                The proctoring system only checks face presence, head orientation, and gaze geometry. It does not perform facial recognition, does not match your face against an identity database, and does not infer emotions or honesty.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
            <Database className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100">3. Only Neutral Event Metadata is Stored</h4>
              <p className="text-xs text-slate-400 mt-1">
                Only lightweight event logs (such as timestamp, duration of absence, or tab switches) are preserved in the Supabase database. No surveillance footage is captured by default.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
            <FileText className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100">4. Transparent Observations & Student Challenge Right</h4>
              <p className="text-xs text-slate-400 mt-1">
                All observations use neutral, objective terminology. No automated cheating scores or dishonesty convictions are calculated. You have the explicit right to explain or challenge any logged event.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100">5. Alternative Non-Webcam Assessment Available</h4>
              <p className="text-xs text-slate-400 mt-1">
                If you do not possess a working camera or have accessibility accommodations, you can choose the Alternative Assessment Mode to complete your interview without video monitoring.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
