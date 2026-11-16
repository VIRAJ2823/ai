'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { CareerChatMessage, CareerRoadmap } from '@/lib/types';

export const CareerGuidanceAgent: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'chat' | 'roadmap' | 'skills' | 'market'>('chat');
  const [messages, setMessages] = useState<CareerChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'agent',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am Aria, your AI Career Guidance Advisor. I help engineers map their career progression toward roles like **${user?.targetRole || 'Full-Stack Software Engineer'}**, analyze skill gaps, prepare for rigorous technical interviews, and maximize compensation offers.

How can I help you accelerate your tech career today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: '🗺️ Generate My 6-Month Roadmap', action: 'generate_roadmap' },
        { label: '🎯 System Design Interview Prep', action: 'prep_system_design' },
        { label: '💰 2026 Salary & Market Insights', action: 'salary_info' },
        { label: '🚀 Start Module 13 Proctored Interview', action: 'start_mock' },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Pre-load roadmap
  useEffect(() => {
    fetchRoadmap();
  }, [user?.targetRole]);

  const fetchRoadmap = async () => {
    setIsLoadingRoadmap(true);
    try {
      const res = await fetch('/api/career/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_roadmap',
          targetRole: user?.targetRole || 'Full-Stack Software Engineer',
          skills: user?.skills || [],
          experienceLevel: user?.experienceLevel || 'Mid-Level',
        }),
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (err) {
      console.error('Error loading roadmap:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: CareerChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/career/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          targetRole: user?.targetRole || 'Full-Stack Software Engineer',
          skills: user?.skills || [],
          experienceLevel: user?.experienceLevel || 'Mid-Level',
        }),
      });

      const data = await res.json();
      const botMsg: CareerChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'agent',
        content: data.reply || 'Here is my recommendation based on market trends and technical benchmarks.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data.actions || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get career guidance response:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'start_mock' || action === 'start_mock_design') {
      router.push('/');
    } else if (action === 'generate_roadmap') {
      setActiveTab('roadmap');
      if (!roadmap) fetchRoadmap();
    } else if (action === 'salary_info') {
      setActiveTab('market');
    } else if (action === 'prep_system_design') {
      handleSendMessage('How should I structure my preparation for System Design interviews?');
    } else if (action === 'analyze_skills') {
      setActiveTab('skills');
    } else {
      handleSendMessage(action.replace(/_/g, ' '));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Career Advisor Agent</span>
            </span>
            <span className="text-xs text-slate-400">
              Personalized for: <strong className="text-slate-200">{user?.targetRole || 'Full-Stack Software Engineer'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Aria: Your Intelligent Career & Interview Copilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Get personalized advancement roadmaps, analyze high-priority skill gaps, master system design architecture, and cross-reference your proctored interview integrity reports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Proctored Mock Interview</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'chat'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Interactive Career Advisor</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'roadmap'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>6-Month Career Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'skills'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Skill Gap Benchmark</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'market'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Market & Salary Intelligence</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE AI CHAT */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col h-[600px]">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => {
                const isBot = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        isBot ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : 'bg-slate-700'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="max-w-xl space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isBot
                            ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm'
                            : 'bg-indigo-600 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>
                      </div>

                      {/* Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(act.action)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition shadow-sm"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3 h-3 text-indigo-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="block text-[10px] text-slate-500 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-1.5 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1">Aria is analyzing engineering patterns...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-4 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Aria about system design, salary negotiation, resume review, or mock interviews..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition shadow-lg shadow-indigo-600/30 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Quick Cards */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Readiness Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Target Role Readiness
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  {roadmap ? `${roadmap.readinessPercentage}% Ready` : '78% Ready'}
                </span>
              </div>

              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${roadmap ? roadmap.readinessPercentage : 78}%` }}
                />
              </div>

              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <p>
                  Estimated Timeline to Hire:{' '}
                  <strong className="text-slate-200">{roadmap?.estimatedTimeToReady || '8 - 12 Weeks'}</strong>
                </p>
                <p>
                  Target Role:{' '}
                  <strong className="text-slate-200">{user?.targetRole || 'Full-Stack Software Engineer'}</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveTab('roadmap')}
                className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1"
              >
                <span>View Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Suggested In-Depth Prompts */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Suggested Career Inquiries</span>
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleSendMessage('How should I explain architectural trade-offs in a system design interview?')}
                  className="w-full text-left p-2.5 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 text-slate-300 transition"
                >
                  "How do I explain architectural trade-offs in system design?"
                </button>
                <button
                  onClick={() => handleSendMessage('What are the highest-paying full-stack competencies in 2026?')}
                  className="w-full text-left p-2.5 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 text-slate-300 transition"
                >
                  "What are the highest-paying full-stack competencies in 2026?"
                </button>
                <button
                  onClick={() => handleSendMessage('How do I build an impressive portfolio project with distributed databases?')}
                  className="w-full text-left p-2.5 bg-slate-950/70 hover:bg-slate-950 rounded-xl border border-slate-800 text-slate-300 transition"
                >
                  "What portfolio projects stand out for backend roles?"
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 6-MONTH CAREER ROADMAP */}
      {activeTab === 'roadmap' && roadmap && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
                  {roadmap.estimatedTimeToReady} Fast-Track
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  Personalized Engineering Roadmap for {roadmap.targetRole}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  {roadmap.summary}
                </p>
              </div>
              <button
                onClick={fetchRoadmap}
                disabled={isLoadingRoadmap}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRoadmap ? 'animate-spin' : ''}`} />
                <span>Refresh Roadmap</span>
              </button>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validated Strengths & Competencies</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {roadmap.keyStrengths.map((str, i) => (
                    <li key={i}>• {str}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>High-Priority Gaps to Close</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {roadmap.criticalGaps.map((gap, i) => (
                    <li key={i}>• {gap}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Roadmap Phases Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200">Execution Phases</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roadmap.phases.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20">
                        {phase.duration}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Phase {idx + 1}</span>
                    </div>

                    <h4 className="font-bold text-slate-100 text-sm">
                      {phase.phase}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {phase.focus}
                    </p>

                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Key Skills to Acquire:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.skillsToAcquire.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md text-[11px] text-slate-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 text-xs text-slate-300">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Capstone Project:
                      </span>
                      <p className="italic text-indigo-300 bg-indigo-950/30 p-2 rounded-xl border border-indigo-900/40">
                        {phase.recommendedProjects[0]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Recommended Credential:</span>
                    <span className="text-xs font-medium text-slate-300">{phase.suggestedCertifications[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILL GAP BENCHMARK */}
      {activeTab === 'skills' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Target Role Skill Gap Benchmark
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-referencing your profile ({user?.targetRole || 'Full-Stack Software Engineer'}) with top 50 tech hiring bars.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Skill / Technology</th>
                  <th className="p-3.5">Market Importance</th>
                  <th className="p-3.5">Your Mastery Status</th>
                  <th className="p-3.5">Action Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { name: 'React 18 Concurrent Rendering & useTransition', weight: 'High Priority (92%)', status: 'Mastered', action: 'Covered in Module 13 Question 1' },
                  { name: 'Distributed Rate Limiting (Token Bucket / Redis)', weight: 'Critical (96%)', status: 'In-Progress', action: 'Covered in Module 13 Question 2' },
                  { name: 'PostgreSQL MVCC & Write-Ahead Logs (WAL)', weight: 'Critical (94%)', status: 'In-Progress', action: 'Covered in Module 13 Question 3' },
                  { name: 'STAR Behavioral Conflict Storytelling', weight: 'High Priority (88%)', status: 'Mastered', action: 'Covered in Module 13 Question 4' },
                  { name: 'Kafka / Distributed Event Queues', weight: 'Medium (76%)', status: 'Pending Acquisition', action: 'Phase 2 of Career Roadmap' },
                  { name: 'Kubernetes Container Orchestration', weight: 'Medium (70%)', status: 'Pending Acquisition', action: 'Phase 2 Capstone Project' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40 transition">
                    <td className="p-3.5 font-semibold text-slate-200">{item.name}</td>
                    <td className="p-3.5 text-indigo-400 font-medium">{item.weight}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === 'Mastered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'In-Progress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MARKET & SALARY INTELLIGENCE */}
      {activeTab === 'market' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              Base Salary Band
            </span>
            <div className="text-2xl font-extrabold text-emerald-400">$120,000 - $165,000</div>
            <p className="text-xs text-slate-400">
              Median base compensation for Mid-Level {user?.targetRole || 'Full-Stack Software Engineer'} in North American and remote tech hubs.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              Total Comp (with Equity)
            </span>
            <div className="text-2xl font-extrabold text-indigo-400">$150,000 - $215,000</div>
            <p className="text-xs text-slate-400">
              Includes annual performance bonuses, RSU grants, and 401(k) matching at Series B+ and enterprise tech employers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              Highest Leverage Competencies
            </span>
            <div className="text-sm font-bold text-purple-400">Distributed Caching & Proctored Stamina</div>
            <p className="text-xs text-slate-400">
              Candidates who demonstrate transparent integrity reports and clear architectural trade-offs command a 15-22% premium during offers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
