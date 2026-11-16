export type MonitoringEventType =
  | 'normal_observation'
  | 'attention_required'
  | 'technical_issue'
  | 'multiple_face_detected'
  | 'tab_visibility_change'
  | 'face_not_detected';

export type ReviewStatus =
  | 'pending'
  | 'student_clarified'
  | 'verified_normal'
  | 'flagged';

export type CameraPermissionStatus =
  | 'pending'
  | 'granted'
  | 'denied'
  | 'alternative_mode';

export type MonitoringStatus =
  | 'active'
  | 'completed'
  | 'terminated_by_user'
  | 'alternative_mode';

export interface HeadOrientation {
  yaw: number; // Left/Right turn in degrees (-90 to +90)
  pitch: number; // Up/Down nod in degrees (-90 to +90)
  roll: number; // Tilt in degrees (-90 to +90)
}

export type GazeDirection = 'center' | 'left' | 'right' | 'up' | 'down' | 'away';

export interface EventMetadata {
  description?: string;
  detail?: string;
  faceCount?: number;
  gazeDirection?: GazeDirection;
  headOrientation?: HeadOrientation;
  browserState?: 'hidden' | 'visible' | 'blur' | 'focus';
  fps?: number;
  resolution?: string;
  lightingCondition?: 'optimal' | 'low' | 'overexposed';
  clientTimestamp?: number;
  triggerSource?: 'visibilitychange' | 'window_blur' | 'face_detector' | 'camera_stream' | 'user_action';
  [key: string]: any;
}

export interface MonitoringEvent {
  id: string;
  monitoring_session_id: string;
  event_type: MonitoringEventType;
  event_timestamp: string;
  duration_seconds: number;
  event_metadata: EventMetadata;
  review_status: ReviewStatus;
  student_challenge_notes?: string;
}

export interface VisionDetectionResult {
  faceCount: number;
  faceDetected: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number };
  headOrientation: HeadOrientation;
  gazeDirection: GazeDirection;
  lightingCondition: 'optimal' | 'low' | 'overexposed';
  luminance: number;
  confidence: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'student' | 'recruiter' | 'admin';
  targetRole: string;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead / Architect';
  skills: string[];
  targetSalary?: string;
  bio?: string;
  completedInterviewsCount: number;
  averagePerformanceScore: number;
}

export interface CareerRoadmapPhase {
  phase: string;
  duration: string;
  focus: string;
  skillsToAcquire: string[];
  recommendedProjects: string[];
  suggestedCertifications: string[];
}

export interface CareerRoadmap {
  targetRole: string;
  readinessPercentage: number;
  estimatedTimeToReady: string;
  summary: string;
  phases: CareerRoadmapPhase[];
  keyStrengths: string[];
  criticalGaps: string[];
}

export interface CareerChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  actions?: { label: string; action: string }[];
}

export interface MonitoringSession {
  id: string;
  student_id: string;
  interview_session_id: string;
  camera_permission_status: CameraPermissionStatus;
  started_at: string;
  ended_at?: string | null;
  monitoring_status: MonitoringStatus;
  total_duration_seconds?: number;
  face_visibility_percentage?: number;
  multiple_face_events_count?: number;
  tab_visibility_events_count?: number;
  face_not_detected_duration_seconds?: number;
  technical_issues_count?: number;
  summary_notes?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend' | 'System Design' | 'Behavioral';
  question: string;
  hint: string;
  suggestedDurationMinutes: number;
  expectedCriteria: string[];
}

export interface AnswerEvaluation {
  technicalKnowledge: number; // 0 - 100
  communication: number; // 0 - 100
  problemSolving: number; // 0 - 100
  overallScore: number; // 0 - 100
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export interface InterviewAnswerRecord {
  questionId: string;
  questionText: string;
  category: string;
  userAnswer: string;
  submittedAt: string;
  evaluation: AnswerEvaluation;
}

export interface FullInterviewReport {
  session: MonitoringSession;
  events: MonitoringEvent[];
  answers: InterviewAnswerRecord[];
  integritySummary: {
    totalDurationSeconds: number;
    cameraAvailabilityPercentage: number;
    faceVisibilityPercentage: number;
    multipleFaceCount: number;
    tabVisibilityChangesCount: number;
    faceNotDetectedDurationSeconds: number;
    technicalIssuesCount: number;
    overallEnvironmentalSummary: string;
  };
  performanceSummary: {
    technicalKnowledgeAvg: number;
    communicationAvg: number;
    problemSolvingAvg: number;
    overallPerformanceScore: number;
    keyStrengths: string[];
    priorityGrowthAreas: string[];
  };
}
