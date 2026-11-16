'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { PlatformOverview } from '@/components/home/PlatformOverview';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs">Loading platform session...</p>
      </div>
    );
  }

  // 1. If not authenticated, show Login / Sign In form first
  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  // 2. Once authenticated, display Platform Overview (Home Page)
  return (
    <main className="min-h-screen bg-slate-950">
      <PlatformOverview />
    </main>
  );
}
