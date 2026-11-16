'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to sign in.');
    }
  };

  const handleDemoSignIn = (role: 'student' | 'recruiter') => {
    quickDemoLogin(role);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center space-x-2.5 mb-2">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            AI Career <span className="text-indigo-400">Platform</span>
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Please sign in to access the platform overview, AI career guidance, and proctoring.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          {/* Quick Demo Sign-In Buttons */}
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              ⚡ 1-Click Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoSignIn('student')}
                className="p-3 bg-slate-800/80 hover:bg-slate-750 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl text-xs font-medium text-slate-200 transition text-center flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <span className="text-emerald-400 font-bold text-sm">Candidate Alex</span>
                <span className="text-[10px] text-slate-400">Student Profile</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('recruiter')}
                className="p-3 bg-slate-800/80 hover:bg-slate-750 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-xs font-medium text-slate-200 transition text-center flex flex-col items-center justify-center space-y-1 shadow-md"
              >
                <span className="text-purple-400 font-bold text-sm">Recruiter Sarah</span>
                <span className="text-[10px] text-slate-400">Reviewer Profile</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
              Or with credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/auth/signup" className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium">
              Don't have an account? Create a profile
            </Link>
          </div>

          {/* Privacy badge */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Client-Side Privacy Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
