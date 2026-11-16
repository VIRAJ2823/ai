'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  FileCheck2,
  FileText,
  Layers,
  ArrowRight,
  EyeOff,
  Lock,
  Cpu,
  Users,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Scale,
} from 'lucide-react';

export const PlatformOverview: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/30 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Technical Career & Interview Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Master Tech Interviews with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400">
            Transparent AI Proctoring
          </span>{' '}
          & Career Intelligence
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! An ethical, privacy-first technical interview platform that combines client-side browser vision proctoring, an interactive career mentor, and a performance-backed AI resume generator.
        </p>

        {/* Guided 3-Step Journey Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/career-guidance"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4" />
            <span>Step 1: AI Career Guidance Agent</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/interview"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Step 2: Proctored Mock Interview</span>
          </Link>

          <Link
            href="/resume-builder"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Step 3: Performance Resume Builder</span>
          </Link>
        </div>

        {/* Quick Trust Badges */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser Local Vision</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>Zero Video Footage Stored</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>No Automated Cheating Convictions</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Full Candidate Challenge Rights</span>
          </div>
        </div>
      </section>

      {/* WHY WAS THIS PLATFORM CREATED? */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            The Philosophy & Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Was This Platform Created?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Addressing the critical flaws of modern remote interviewing and invasive surveillance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Ending Black-Box Surveillance & Paranoia
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional proctoring software uses invasive background daemons, records continuous candidate video, and computes opaque "cheating probability" scores that penalize normal eye movements or room lighting without recourse.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Realistic, Feedback-Driven Preparation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practicing coding alone doesn't build interview conditioning. Candidates need a realistic simulation that tests articulate communication, structured problem breakdown, and concurrent technical reasoning under live timed conditions.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Bridging Learning to Hiring Verification
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recruiters need to verify authentic technical capability in the era of generative AI, while candidates deserve a verifiable credential that proves their honest problem-solving mastery without sacrificing their digital privacy.
            </p>
          </div>
        </div>
      </section>

      {/* FOR WHOM WAS IT MADE? */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Tailored Audiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            For Whom Was It Made?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Built specifically to empower students, career switchers, and modern engineering hiring teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl w-fit">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Computer Science Students</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Undergraduate and graduate students preparing for competitive campus placements, internships, and entry-level engineering roles at top tech companies.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Career Switchers & Upskillers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineers transitioning into high-demand specializations (e.g., Frontend to Staff Full-Stack, Backend to AI/ML or Cloud DevOps Architecture).
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Bootcamps & Career Centers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Educational institutions that want to offer students an ethical, standardized mock interview testing laboratory with verifiable integrity reports.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-2.5 bg-sky-600/20 text-sky-400 rounded-xl w-fit">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Recruiters & Hiring Leads</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Technical talent teams looking for transparent, audited candidate assessments that guarantee genuine competency while respecting candidate privacy.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT ARE ITS ADVANTAGES? */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Key Advantages & Differentiators
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            What Are Its Core Advantages?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The platform combines ethical artificial intelligence with deep career advancement tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">100% In-Browser Privacy Protection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All facial presence detection, head orientation, and gaze geometry run purely in browser RAM. Zero raw webcam frames or audio feeds are recorded or saved to remote databases.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <Scale className="w-6 h-6 text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-100">Neutral Observations & Student Rights</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box "cheating scores" or dishonesty accusations. Every logged event (e.g., face absent for 4s, tab switch) uses objective terminology and can be explained or challenged by the student.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <Compass className="w-6 h-6 text-purple-400" />
            <h4 className="text-sm font-bold text-slate-100">Integrated AI Career Advisor ("Aria")</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates customized 6-month career roadmaps, analyzes high-priority technical skill gaps, and prepares candidates for system design and behavioral salary negotiations.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-bold text-slate-100">Dual-Section Comprehensive Reports</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrates Technical Interview Performance (accuracy, clarity, problem-solving rubrics) with Environmental Integrity Observations into a single verifiable PDF/JSON report.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <Cpu className="w-6 h-6 text-sky-400" />
            <h4 className="text-sm font-bold text-slate-100">Alternative Assessment Inclusivity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Candidates experiencing camera hardware malfunctions or accessibility needs can switch to Alternative Assessment Mode without penalty.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">Performance-Driven AI Resume Builder</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically transforms your verified mock interview competencies and system architecture strengths into a quantified, ATS-optimized engineering resume.
            </p>
          </div>
        </div>
      </section>

      {/* THE 4-STEP CAREER ACCELERATION WORKFLOW */}
      <section className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Your Success Pathway
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The 4-Step Career Acceleration Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Follow this structured cycle from initial guidance to a verified hire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/career-guidance"
            className="group bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500/20">
                Step 1
              </span>
              <h4 className="font-bold text-slate-100 text-sm group-hover:text-indigo-400 transition">
                AI Career Guidance
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive customized 6-month roadmap, analyze skill gaps, and explore 2026 salary benchmarks with Aria.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-400 flex items-center space-x-1">
              <span>Open Career Agent</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/interview"
            className="group bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">
                Step 2
              </span>
              <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition">
                Proctored Mock Interview
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete a timed technical interview with real-time camera proctoring, head pose tracking, and voice dictation.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <span>Start Interview</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/history"
            className="group bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/20">
                Step 3
              </span>
              <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-400 transition">
                Review Integrity Report
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review performance rubrics, inspect environmental telemetry logs, and challenge observations if needed.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
              <span>View Audits</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          <Link
            href="/resume-builder"
            className="group bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-lg border border-purple-500/20">
                Step 4
              </span>
              <h4 className="font-bold text-slate-100 text-sm group-hover:text-purple-400 transition">
                AI Resume Builder
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn your interview metrics and system design capabilities into an ATS-ready resume with verified integrity badges.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-400 flex items-center space-x-1">
              <span>Build My Resume</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
