'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Compass,
  FileCheck2,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Home,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'AI Career Guidance',
      href: '/career-guidance',
      icon: Compass,
      badge: 'Step 1',
    },
    {
      name: 'AI Mock Interview',
      href: '/interview',
      icon: Layers,
      badge: 'Step 2 • Module 13',
    },
    {
      name: 'AI Resume Builder',
      href: '/resume-builder',
      icon: FileText,
      badge: 'Step 3',
    },
    {
      name: 'Integrity Audits',
      href: '/history',
      icon: FileCheck2,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">
                AI Career <span className="text-indigo-400">Platform</span>
              </span>
              <span className="text-[10px] text-slate-400">Guidance • Proctoring • Resumes</span>
            </div>
          </Link>

          {/* Navigation Links (Visible only when logged in) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-400 text-[9px] border border-indigo-800/60 font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* User Account / Auth Section */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-left"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-xs">
                  <span className="font-semibold text-slate-200 block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {user.role} • {user.targetRole.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 text-xs text-slate-200 z-50 divide-y divide-slate-800">
                  <div className="p-2.5 space-y-1">
                    <p className="font-semibold text-slate-100">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                    <div className="pt-1 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold border border-indigo-500/20">
                        {user.targetRole}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/career-guidance"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                    >
                      <Compass className="w-4 h-4 text-indigo-400" />
                      <span>AI Career Guidance Agent</span>
                    </Link>
                    <Link
                      href="/interview"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Proctored Mock Interview</span>
                    </Link>
                    <Link
                      href="/resume-builder"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>AI Performance Resume</span>
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                    >
                      <FileCheck2 className="w-4 h-4 text-sky-400" />
                      <span>My Integrity Audits</span>
                    </Link>
                  </div>

                  <div className="py-1 space-y-1">
                    <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Switch Role
                    </span>
                    <button
                      onClick={() => {
                        quickDemoLogin('student');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                    >
                      <span>Student (Alex)</span>
                      {user.role === 'student' && <span className="text-emerald-400 text-[10px]">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        quickDemoLogin('recruiter');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                    >
                      <span>Recruiter (Sarah)</span>
                      {user.role === 'recruiter' && <span className="text-purple-400 text-[10px]">Active</span>}
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
