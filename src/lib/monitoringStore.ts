import { MonitoringSession, MonitoringEvent, ReviewStatus, FullInterviewReport, InterviewAnswerRecord } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

// In-memory fallback repository for server-side persistence during the session
declare global {
  var __monitoringSessions: Map<string, MonitoringSession> | undefined;
  var __monitoringEvents: Map<string, MonitoringEvent[]> | undefined;
  var __interviewAnswers: Map<string, InterviewAnswerRecord[]> | undefined;
}

if (!global.__monitoringSessions) {
  global.__monitoringSessions = new Map<string, MonitoringSession>();
}
if (!global.__monitoringEvents) {
  global.__monitoringEvents = new Map<string, MonitoringEvent[]>();
}
if (!global.__interviewAnswers) {
  global.__interviewAnswers = new Map<string, InterviewAnswerRecord[]>();
}

export const monitoringStore = {
  async createSession(session: Omit<MonitoringSession, 'started_at'> & { started_at?: string }): Promise<MonitoringSession> {
    const fullSession: MonitoringSession = {
      ...session,
      started_at: session.started_at || new Date().toISOString(),
      monitoring_status: session.monitoring_status || 'active',
      total_duration_seconds: 0,
      face_visibility_percentage: 100,
      multiple_face_events_count: 0,
      tab_visibility_events_count: 0,
      face_not_detected_duration_seconds: 0,
      technical_issues_count: 0,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('interview_monitoring_sessions')
          .insert([fullSession])
          .select()
          .single();
        if (error) console.error('Supabase createSession error:', error);
        if (data) {
          global.__monitoringSessions?.set(data.id, data);
          return data;
        }
      } catch (err) {
        console.error('Failed to write session to Supabase, falling back to memory store:', err);
      }
    }

    global.__monitoringSessions?.set(fullSession.id, fullSession);
    return fullSession;
  },

  async getSession(id: string): Promise<MonitoringSession | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('interview_monitoring_sessions')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getSession error:', err);
      }
    }

    return global.__monitoringSessions?.get(id) || null;
  },

  async updateSession(id: string, updates: Partial<MonitoringSession>): Promise<MonitoringSession | null> {
    let existing = await this.getSession(id);
    if (!existing) {
      existing = {
        id,
        student_id: 'std_demo_' + Math.random().toString(36).substring(7),
        interview_session_id: 'int_' + id,
        camera_permission_status: 'granted',
        started_at: new Date().toISOString(),
        monitoring_status: 'active',
      };
    }

    const updated: MonitoringSession = {
      ...existing,
      ...updates,
      ended_at: updates.ended_at !== undefined ? updates.ended_at : existing.ended_at,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('interview_monitoring_sessions')
          .update(updated)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          global.__monitoringSessions?.set(id, data);
          return data;
        }
      } catch (err) {
        console.error('Supabase updateSession error:', err);
      }
    }

    global.__monitoringSessions?.set(id, updated);
    return updated;
  },

  async addEvent(event: Omit<MonitoringEvent, 'id' | 'event_timestamp'> & { id?: string; event_timestamp?: string }): Promise<MonitoringEvent> {
    const fullEvent: MonitoringEvent = {
      ...event,
      id: event.id || 'evt_' + Math.random().toString(36).substring(2, 11),
      event_timestamp: event.event_timestamp || new Date().toISOString(),
      review_status: event.review_status || 'pending',
      duration_seconds: event.duration_seconds || 0,
      event_metadata: event.event_metadata || {},
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('interview_monitoring_events')
          .insert([fullEvent])
          .select()
          .single();
        if (!error && data) {
          const list = global.__monitoringEvents?.get(fullEvent.monitoring_session_id) || [];
          list.push(data);
          global.__monitoringEvents?.set(fullEvent.monitoring_session_id, list);
          return data;
        }
      } catch (err) {
        console.error('Supabase addEvent error:', err);
      }
    }

    const list = global.__monitoringEvents?.get(fullEvent.monitoring_session_id) || [];
    list.push(fullEvent);
    global.__monitoringEvents?.set(fullEvent.monitoring_session_id, list);
    return fullEvent;
  },

  async getEventsBySession(sessionId: string): Promise<MonitoringEvent[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('interview_monitoring_events')
          .select('*')
          .eq('monitoring_session_id', sessionId)
          .order('event_timestamp', { ascending: true });
        if (!error && data) {
          global.__monitoringEvents?.set(sessionId, data);
          return data;
        }
      } catch (err) {
        console.error('Supabase getEvents error:', err);
      }
    }

    return global.__monitoringEvents?.get(sessionId) || [];
  },

  async challengeEvent(eventId: string, sessionId: string, challengeNotes: string): Promise<MonitoringEvent | null> {
    const list = await this.getEventsBySession(sessionId);
    const target = list.find(e => e.id === eventId);
    if (!target) return null;

    target.review_status = 'student_clarified';
    target.student_challenge_notes = challengeNotes;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('interview_monitoring_events')
          .update({
            review_status: 'student_clarified',
            student_challenge_notes: challengeNotes,
          })
          .eq('id', eventId);
      } catch (err) {
        console.error('Supabase challengeEvent update error:', err);
      }
    }

    return target;
  },

  async saveInterviewAnswer(sessionId: string, answer: InterviewAnswerRecord): Promise<void> {
    const list = global.__interviewAnswers?.get(sessionId) || [];
    const index = list.findIndex(a => a.questionId === answer.questionId);
    if (index >= 0) {
      list[index] = answer;
    } else {
      list.push(answer);
    }
    global.__interviewAnswers?.set(sessionId, list);
  },

  async getInterviewAnswers(sessionId: string): Promise<InterviewAnswerRecord[]> {
    return global.__interviewAnswers?.get(sessionId) || [];
  },

  async generateFullReport(sessionId: string): Promise<FullInterviewReport | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    const events = await this.getEventsBySession(sessionId);
    const answers = await this.getInterviewAnswers(sessionId);

    // Calculate duration
    const startTime = new Date(session.started_at).getTime();
    const endTime = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();
    const totalDurationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));

    // Environmental calculations
    const multiFaceEvents = events.filter(e => e.event_type === 'multiple_face_detected');
    const tabEvents = events.filter(e => e.event_type === 'tab_visibility_change');
    const faceAbsentEvents = events.filter(e => e.event_type === 'face_not_detected');
    const techIssues = events.filter(e => e.event_type === 'technical_issue');

    const faceNotDetectedSeconds = faceAbsentEvents.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
    const measurableSeconds = Math.max(totalDurationSeconds, 1);
    const faceVisibilityPercentage = Math.max(
      0,
      Math.min(100, Math.round(((measurableSeconds - faceNotDetectedSeconds) / measurableSeconds) * 1000) / 10)
    );

    const cameraAvailabilityPercentage = session.camera_permission_status === 'granted'
      ? Math.max(90, 100 - (techIssues.length * 2))
      : 0;

    // Environmental summary in neutral, objective language
    let environmentalSummary = 'Normal interview environment conditions observed throughout the session.';
    if (multiFaceEvents.length > 0 || tabEvents.length > 0 || faceAbsentEvents.length > 0) {
      const parts: string[] = [];
      if (faceVisibilityPercentage < 85) parts.push(`Face was visible for ${faceVisibilityPercentage}% of the interview`);
      if (multiFaceEvents.length > 0) parts.push(`${multiFaceEvents.length} multiple-face observation(s) noted`);
      if (tabEvents.length > 0) parts.push(`${tabEvents.length} tab switch event(s) recorded`);
      if (techIssues.length > 0) parts.push(`${techIssues.length} technical camera observation(s)`);
      environmentalSummary = `Interview recorded with contextual observations: ${parts.join(', ')}. All observations remain open for student context review.`;
    }

    // Performance calculations
    let technicalKnowledgeAvg = 80;
    let communicationAvg = 82;
    let problemSolvingAvg = 78;

    if (answers.length > 0) {
      technicalKnowledgeAvg = Math.round(answers.reduce((acc, a) => acc + a.evaluation.technicalKnowledge, 0) / answers.length);
      communicationAvg = Math.round(answers.reduce((acc, a) => acc + a.evaluation.communication, 0) / answers.length);
      problemSolvingAvg = Math.round(answers.reduce((acc, a) => acc + a.evaluation.problemSolving, 0) / answers.length);
    }

    const overallPerformanceScore = Math.round((technicalKnowledgeAvg * 0.4) + (communicationAvg * 0.3) + (problemSolvingAvg * 0.3));

    return {
      session: {
        ...session,
        total_duration_seconds: totalDurationSeconds,
        face_visibility_percentage: faceVisibilityPercentage,
        multiple_face_events_count: multiFaceEvents.length,
        tab_visibility_events_count: tabEvents.length,
        face_not_detected_duration_seconds: Math.round(faceNotDetectedSeconds),
        technical_issues_count: techIssues.length,
        summary_notes: environmentalSummary,
      },
      events,
      answers,
      integritySummary: {
        totalDurationSeconds,
        cameraAvailabilityPercentage,
        faceVisibilityPercentage,
        multipleFaceCount: multiFaceEvents.length,
        tabVisibilityChangesCount: tabEvents.length,
        faceNotDetectedDurationSeconds: Math.round(faceNotDetectedSeconds),
        technicalIssuesCount: techIssues.length,
        overallEnvironmentalSummary: environmentalSummary,
      },
      performanceSummary: {
        technicalKnowledgeAvg,
        communicationAvg,
        problemSolvingAvg,
        overallPerformanceScore,
        keyStrengths: [
          'Clear articulation of core engineering concepts and architecture decisions',
          'Structured problem breakdown and step-by-step reasoning',
          'Consistent professional communication and responsiveness',
        ],
        priorityGrowthAreas: [
          'Incorporate deeper quantitative benchmarks and edge-case boundary conditions',
          'Elaborate more on distributed failure modes and retry semantics',
        ],
      },
    };
  },
};
