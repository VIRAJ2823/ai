'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, targetRole: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: (role?: 'student' | 'recruiter' | 'admin') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEMO_STUDENT: UserProfile = {
  id: 'usr_student_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@cs.edu',
  role: 'student',
  targetRole: 'Full-Stack Software Engineer',
  experienceLevel: 'Entry-Level',
  skills: ['TypeScript', 'React.js', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
  targetSalary: '$125,000 / year',
  bio: 'Recent computer science graduate passionate about scalable distributed systems and reactive UI design.',
  completedInterviewsCount: 4,
  averagePerformanceScore: 84,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

const DEMO_RECRUITER: UserProfile = {
  id: 'usr_recruiter_01',
  name: 'Sarah Jenkins',
  email: 's.jenkins@techrecruits.io',
  role: 'recruiter',
  targetRole: 'Technical Talent Lead',
  experienceLevel: 'Lead / Architect',
  skills: ['Technical Screening', 'System Design Assessments', 'Behavioral Rubrics', 'Hiring Ops'],
  targetSalary: '$160,000 / year',
  bio: 'Senior Technical Recruiter reviewing engineering candidate portfolios and integrity audits.',
  completedInterviewsCount: 28,
  averagePerformanceScore: 92,
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_mock_proctor_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _pass: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const loggedUser: UserProfile = {
      ...DEMO_STUDENT,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };

    setUser(loggedUser);
    localStorage.setItem('ai_mock_proctor_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, _pass: string, targetRole: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'student',
      targetRole: targetRole || 'Full-Stack Software Engineer',
      experienceLevel: 'Entry-Level',
      skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
      targetSalary: '$110,000 / year',
      bio: 'Aspiring software engineer preparing for top-tier tech interviews.',
      completedInterviewsCount: 0,
      averagePerformanceScore: 0,
    };

    setUser(newUser);
    localStorage.setItem('ai_mock_proctor_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_mock_proctor_user');
  };

  const quickDemoLogin = (role: 'student' | 'recruiter' | 'admin' = 'student') => {
    const selected = role === 'recruiter' ? DEMO_RECRUITER : DEMO_STUDENT;
    setUser(selected);
    localStorage.setItem('ai_mock_proctor_user', JSON.stringify(selected));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('ai_mock_proctor_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        quickDemoLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
