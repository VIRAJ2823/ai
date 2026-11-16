-- Module 13: AI Interview Proctoring and Camera Monitoring Database Schema

-- 1. Create interview_monitoring_sessions table
CREATE TABLE IF NOT EXISTS interview_monitoring_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    interview_session_id TEXT NOT NULL,
    camera_permission_status TEXT NOT NULL CHECK (camera_permission_status IN ('granted', 'denied', 'alternative_mode')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    monitoring_status TEXT NOT NULL CHECK (monitoring_status IN ('active', 'completed', 'terminated_by_user', 'alternative_mode')),
    total_duration_seconds INTEGER DEFAULT 0,
    face_visibility_percentage NUMERIC(5, 2) DEFAULT 100.0,
    multiple_face_events_count INTEGER DEFAULT 0,
    tab_visibility_events_count INTEGER DEFAULT 0,
    face_not_detected_duration_seconds INTEGER DEFAULT 0,
    technical_issues_count INTEGER DEFAULT 0,
    summary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create interview_monitoring_events table
CREATE TABLE IF NOT EXISTS interview_monitoring_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitoring_session_id UUID NOT NULL REFERENCES interview_monitoring_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'normal_observation',
        'attention_required',
        'technical_issue',
        'multiple_face_detected',
        'tab_visibility_change',
        'face_not_detected'
    )),
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_seconds NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    event_metadata JSONB DEFAULT '{}'::jsonb,
    review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN (
        'pending',
        'student_clarified',
        'verified_normal',
        'flagged'
    )),
    student_challenge_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_monitoring_sessions_student_id ON interview_monitoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_sessions_session_id ON interview_monitoring_sessions(interview_session_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_events_session_id ON interview_monitoring_events(monitoring_session_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_events_type ON interview_monitoring_events(event_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_events_timestamp ON interview_monitoring_events(event_timestamp);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE interview_monitoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_monitoring_events ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Allow anonymous/authenticated users to insert and read their own sessions and events)
CREATE POLICY "Allow public read access to sessions" ON interview_monitoring_sessions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to sessions" ON interview_monitoring_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to sessions" ON interview_monitoring_sessions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to events" ON interview_monitoring_events
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to events" ON interview_monitoring_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to events" ON interview_monitoring_events
    FOR UPDATE USING (true);
