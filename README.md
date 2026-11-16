# Module 13: AI-Powered Interview Proctoring and Camera Monitoring

A comprehensive, production-grade AI Interview Proctoring System integrated into the AI Mock Interview module. Built with Next.js 14 (App Router), React, Tailwind CSS, Supabase, and real-time client-side computer vision with the HTML5 MediaDevices & Page Visibility APIs.

---

## 🌟 Key Features & Requirements Matrix

| Requirement | Implementation Detail | Location |
| :--- | :--- | :--- |
| **1. Camera Permission & Setup** | Pre-interview informed consent explaining monitored events, explicit opt-in, live mirrored preview, head alignment ellipse, lighting & resolution telemetry, interactive camera calibration check, alternative non-webcam mode. | `src/components/proctoring/CameraSetupModal.tsx` |
| **2. Real-Time Face Monitoring** | Single face presence, multiple face detection (>1 in frame), continuous visibility %, temporal smoothing, and event logging with metadata (type, timestamp, duration, frequency, session ID). Zero biometric identity recognition. | `src/lib/vision/visionDetector.ts` |
| **3. Eye Gaze & Head Movement** | Yaw (pan left/right), Pitch (tilt up/down), and Roll angles calculated in real-time at 30 FPS. Visual reticle and 3D pose compass. Neutral observation of sustained deflections (>4.5s) without emotion or honesty inferences. | `src/components/proctoring/HeadPoseIndicator.tsx` |
| **4. Browser Activity Monitoring** | HTML5 Page Visibility API (`document.hidden`, `visibilitychange`) and window focus/blur listeners. Live warning toast banner when switched away. No access to external apps or history. | `src/lib/vision/browserMonitor.ts` |
| **5. Interview Monitoring Dashboard** | **Left:** Live webcam with toggleable AI landmark/vector HUD, face status pill, session timer.<br>**Right:** AI questions, voice dictation, answer input, rubric hints, instant evaluation.<br>**Bottom:** Real-time neutral event timeline, connection health, session status. | `src/components/interview/InterviewSession.tsx`<br>`src/components/proctoring/WebcamProctorView.tsx` |
| **6. Event Classification** | Categorized into 6 neutral types: `normal_observation`, `attention_required`, `technical_issue`, `multiple_face_detected`, `tab_visibility_change`, `face_not_detected`. No cheating convictions. | `src/lib/types.ts`<br>`src/components/proctoring/EventTimeline.tsx` |
| **7. Interview Integrity Report** | Total duration, camera availability %, face visibility %, multiple-face count, tab-switch count, face-absent duration, timestamped logs, and student challenge/explanation submission. | `src/components/report/CombinedInterviewReport.tsx` |
| **8. Database Schema** | Supabase Postgres tables: `interview_monitoring_sessions` & `interview_monitoring_events` with RLS, indexes, and full metadata storage. In-memory fallback provided. | `supabase/migrations/20261116000000_interview_monitoring_schema.sql` |
| **9. Privacy & Security** | Explicit consent, 100% client-side video processing (no raw video uploaded), zero saved footage, no biometric face-matching, immediate stop-monitoring toggle, alternative mode for camera-less candidates. | `src/components/proctoring/PrivacyPolicyModal.tsx` |
| **10. Final Combined Report** | Distinct dual sections: **Section A** (Technical knowledge, communication, problem-solving, answer feedback) & **Section B** (Camera availability, face visibility, observations, student notes). Print & JSON export. | `src/components/report/CombinedInterviewReport.tsx` |

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Computer Vision**: Client-side Canvas-accelerated Vision Engine with geometric pose/gaze tracking and MediaPipe tasks support
- **State & Storage**: Next.js Backend APIs (`/api/monitoring/*`, `/api/interview/*`) + Supabase PostgreSQL schema with local memory sync
- **Audio & Speech**: Browser SpeechSynthesis for reading questions aloud + Web Speech API for candidate voice dictation

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional)
Create `.env.local` using `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
> *Note: If Supabase credentials are not provided, the application automatically uses the built-in resilient in-memory session and event repository.*

### 3. Run Supabase Migration
Apply `supabase/migrations/20261116000000_interview_monitoring_schema.sql` in the Supabase SQL editor.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚖️ Ethics & Privacy Principles

1. **No Cheating Probability**: System avoids pseudo-scientific dishonesty scoring. All observations remain objective environmental telemetry.
2. **Local Video Processing**: Video streams never leave the user's browser.
3. **Candidate Defense Right**: Every candidate can review and submit an explanatory context note for any observation.
4. **Inclusive Alternatives**: Candidates with technical camera malfunctions or privacy constraints can complete the interview using the Alternative Assessment Mode without penalty.
