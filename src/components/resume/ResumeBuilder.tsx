'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Sparkles,
  Award,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ResumeData {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  verifiedScore: number;
  faceUptime: number;
  auditId: string;
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
  experience: {
    title: string;
    company: string;
    period: string;
    location: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    techStack: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
}

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initial resume data populated from candidate's profile and verified interview performance
  const [resume, setResume] = useState<ResumeData>({
    fullName: user?.name || 'Alex Rivera',
    targetTitle: user?.targetRole || 'Full-Stack Software Engineer',
    email: user?.email || 'alex.rivera@cs.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA / Remote',
    linkedin: 'linkedin.com/in/alex-rivera-swe',
    github: 'github.com/alexrivera-dev',
    verifiedScore: user?.averagePerformanceScore || 86,
    faceUptime: 98.2,
    auditId: 'AUD-MOD13-8942-VERIFIED',
    summary:
      'Performance-verified Full-Stack Software Engineer with proven architectural competency in concurrent UI rendering and distributed systems. Evaluated at 86/100 on Module 13 Proctored System Design and Backend ACID benchmarks. Passionate about engineering high-throughput, low-latency microservices with automated resilience.',
    skills: {
      languages: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'SQL (PostgreSQL)', 'Go'],
      frameworks: ['React 18', 'Next.js 14', 'Node.js', 'Express', 'Tailwind CSS'],
      databases: ['PostgreSQL (MVCC / WAL)', 'Redis (Lua Scripting)', 'Supabase'],
      tools: ['Docker', 'Git', 'Kubernetes', 'Jest', 'Playwright', 'GitHub Actions CI/CD'],
    },
    experience: [
      {
        title: 'Full-Stack Software Engineering Intern',
        company: 'Apex Cloud Systems',
        period: 'Jun 2025 – Present',
        location: 'San Francisco, CA',
        bullets: [
          'Engineered a distributed token-bucket rate limiter with Redis Lua scripts, mitigating burst traffic and sustaining 18,000+ QPS with <3ms p99 latency.',
          'Leveraged React 18 Concurrent Renderer and useTransition to eliminate UI frame blocking during real-time data table filtering across 50,000+ records.',
          'Configured PostgreSQL transaction isolation levels and monitored write-ahead logs (WAL), reducing autovacuum bloat and improving query latency by 32%.',
        ],
      },
      {
        title: 'Software Development Associate',
        company: 'NextGen University Labs',
        period: 'Sep 2024 – May 2025',
        location: 'Remote',
        bullets: [
          'Developed full-stack web applications with Next.js App Router and PostgreSQL, supporting 2,500+ active student researchers.',
          'Automated CI/CD test deployment workflows using GitHub Actions and Docker, accelerating release frequency by 40%.',
        ],
      },
    ],
    projects: [
      {
        name: 'Distributed Rate-Limiting Microservice (Token & Sliding Window)',
        techStack: 'Node.js, TypeScript, Redis, Docker, Prometheus',
        bullets: [
          'Designed and deployed a high-availability rate limiting proxy evaluating fixed window, token bucket, and sliding window log algorithms.',
          'Handled cluster failovers using Redis Sentinel and achieved 99.98% service uptime under simulated network partitioning.',
        ],
      },
      {
        name: 'Real-Time Proctored AI Interview Ecosystem (Module 13)',
        techStack: 'Next.js 14, React 18, MediaPipe Vision, Supabase, Tailwind CSS',
        bullets: [
          'Engineered an in-browser local vision engine running at 30 FPS to track head pose orientation and gaze geometry with 0 raw video uploads.',
          'Integrated browser Page Visibility telemetry and built an audit challenge mechanism empowering candidates with complete privacy transparency.',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Davis',
        year: 'Graduated May 2025',
        gpa: '3.82 / 4.00',
      },
    ],
  });

  const handleEnhanceWithAI = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setResume((prev) => ({
        ...prev,
        summary: `Performance-Verified ${prev.targetTitle} demonstrating top-tier problem solving (86/100 Module 13 Score) and proven distributed systems architecture depth. Adept at eliminating race conditions with Redis primitives, optimizing relational query plans via PostgreSQL MVCC, and architecting responsive concurrent React interfaces.`,
        experience: prev.experience.map((exp, idx) =>
          idx === 0
            ? {
                ...exp,
                bullets: [
                  'Architected distributed rate-limiting microservice using Redis token-bucket Lua scripts; eliminated race conditions under 18,000 QPS load with <2.4ms p99 latency.',
                  'Refactored frontend state using React 18 concurrent transitions and interruptible rendering, slashing main-thread input delay by 45%.',
                  'Tuned PostgreSQL vacuuming parameters and analyzed execution plans across multi-table joins, reducing query runtimes by 34%.',
                ],
              }
            : exp
        ),
      }));
      setIsEnhancing(false);
    }, 900);
  };

  const handleCopyMarkdown = () => {
    const md = `# ${resume.fullName}
**${resume.targetTitle}** | ${resume.email} | ${resume.phone} | ${resume.location}
LinkedIn: ${resume.linkedin} | GitHub: ${resume.github}
*Verified Interview Integrity Score: ${resume.verifiedScore}/100 (Audit ID: ${resume.auditId})*

---

## PROFESSIONAL SUMMARY
${resume.summary}

## TECHNICAL SKILLS
- **Languages:** ${resume.skills.languages.join(', ')}
- **Frameworks & Libraries:** ${resume.skills.frameworks.join(', ')}
- **Databases & Caching:** ${resume.skills.databases.join(', ')}
- **Developer Tools & CI/CD:** ${resume.skills.tools.join(', ')}

## WORK EXPERIENCE
${resume.experience
  .map(
    (exp) => `### ${exp.title} — ${exp.company}
*${exp.period} | ${exp.location}*
${exp.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## PROJECTS
${resume.projects
  .map(
    (proj) => `### ${proj.name} [${proj.techStack}]
${proj.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## EDUCATION
${resume.education
  .map((edu) => `**${edu.degree}**, ${edu.institution} (${edu.year})`)
  .join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Performance-Driven AI Resume Builder</span>
            </span>
            <span className="text-xs text-slate-400">
              Verified Mock Score: <strong className="text-emerald-400">{resume.verifiedScore}/100</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            ATS-Optimized Engineering Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Automatically enhanced with your verified Module 13 mock interview metrics, architectural problem-solving achievements, and verifiable integrity badge.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition"
          >
            <Sparkles className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Optimizing Bullets...' : 'Enhance with AI Performance'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-2 transition"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Quick Editor & Right Live Resume Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls & Performance Integration */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Module 13 Performance Metric Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Interview Performance Sync</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This resume includes your verified technical competencies from Module 13:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Technical Score:</span>
                <span className="font-bold text-emerald-400">{resume.verifiedScore} / 100</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Face Visibility Uptime:</span>
                <span className="font-bold text-sky-400">{resume.faceUptime}%</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Audit Verification ID:</span>
                <span className="font-mono text-purple-400 text-[11px]">{resume.auditId}</span>
              </div>
            </div>

            <Link
              href="/interview"
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <span>Take New Interview to Update Score</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Target Role Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-200">Customize Target Headline</h3>
            <div>
              <label className="block text-slate-400 mb-1">Target Engineering Role:</label>
              <input
                type="text"
                value={resume.targetTitle}
                onChange={(e) => setResume({ ...resume, targetTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Full Name:</label>
              <input
                type="text"
                value={resume.fullName}
                onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Email:</label>
              <input
                type="text"
                value={resume.email}
                onChange={(e) => setResume({ ...resume, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Printable ATS-Compliant Resume Sheet */}
        <div className="lg:col-span-8">
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-300 font-sans space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* Header */}
            <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-950">
                {resume.fullName}
              </h1>
              <p className="text-sm font-bold text-indigo-700 tracking-wide uppercase">
                {resume.targetTitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium pt-1">
                <span>{resume.email}</span>
                <span>•</span>
                <span>{resume.phone}</span>
                <span>•</span>
                <span>{resume.location}</span>
                <span>•</span>
                <span className="text-indigo-600 font-semibold">{resume.linkedin}</span>
                <span>•</span>
                <span className="text-indigo-600 font-semibold">{resume.github}</span>
              </div>
            </div>

            {/* Verified Proctoring Credential Badge */}
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">
                    Module 13 Verified Interview Integrity & Technical Benchmark
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Proctored assessment score: <strong>{resume.verifiedScore}/100</strong> • Face presence visibility: <strong>{resume.faceUptime}%</strong>
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-indigo-700 font-semibold">
                ID: {resume.auditId}
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {resume.summary}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                Technical Skills
              </h2>
              <div className="text-xs text-slate-700 space-y-1">
                <p>
                  <strong className="text-slate-900 font-semibold">Programming Languages:</strong>{' '}
                  {resume.skills.languages.join(', ')}
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Frameworks & Libraries:</strong>{' '}
                  {resume.skills.frameworks.join(', ')}
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Databases & Caching:</strong>{' '}
                  {resume.skills.databases.join(', ')}
                </p>
                <p>
                  <strong className="text-slate-900 font-semibold">Cloud, DevOps & Tools:</strong>{' '}
                  {resume.skills.tools.join(', ')}
                </p>
              </div>
            </div>

            {/* Professional Experience */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-3">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900">
                        {exp.title} — <span className="font-semibold text-slate-700">{exp.company}</span>
                      </span>
                      <span className="text-slate-500 font-medium">{exp.period} | {exp.location}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                Featured Engineering Projects
              </h2>
              <div className="space-y-3">
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      <span className="text-indigo-700 font-mono text-[11px]">{proj.techStack}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                      {proj.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
                Education
              </h2>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-xs text-slate-700">
                  <span className="font-bold text-slate-900">
                    {edu.degree} — <span className="font-normal text-slate-700">{edu.institution}</span>
                  </span>
                  <span className="text-slate-500 font-medium">
                    {edu.year} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
