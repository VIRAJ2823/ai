import { NextRequest, NextResponse } from 'next/server';
import { CareerRoadmap } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, message, targetRole, skills, experienceLevel } = body;

    const role = targetRole || 'Full-Stack Software Engineer';

    if (action === 'generate_roadmap') {
      const roadmap: CareerRoadmap = {
        targetRole: role,
        readinessPercentage: 78,
        estimatedTimeToReady: '8 to 12 Weeks',
        summary: `Tailored advancement blueprint to land mid-to-senior ${role} positions. Focuses on system architecture depth, concurrent rendering, and distributed database reliability.`,
        keyStrengths: [
          'Proficiency with modern TypeScript, React, and modular component design',
          'Solid grasp of relational modeling with PostgreSQL',
          'Familiarity with containerized development and CI/CD pipelines',
        ],
        criticalGaps: [
          'Distributed rate limiting, consensus algorithms, and cache stampede mitigation',
          'PostgreSQL MVCC vacuuming, connection pool tuning, and write-ahead logs (WAL)',
          'High-stress mock interview stamina and STAR-method behavioral storytelling',
        ],
        phases: [
          {
            phase: 'Phase 1: Advanced Engineering & Core Internals',
            duration: 'Weeks 1 - 4',
            focus: 'Master React Concurrent Mode, Web Workers, Node.js Event Loop bottlenecks, and SQL indexing strategies.',
            skillsToAcquire: ['PostgreSQL MVCC & Query Plans', 'React 18 Concurrent Rendering', 'Redis Distributed Primitives'],
            recommendedProjects: ['High-throughput API Rate Limiter microservice with Redis Lua scripts'],
            suggestedCertifications: ['AWS Certified Developer Associate / Meta Senior Full-Stack Track'],
          },
          {
            phase: 'Phase 2: Scalable Distributed Systems & Capstone',
            duration: 'Weeks 5 - 8',
            focus: 'Design multi-region architectures, asynchronous job queues, and event-driven microservices.',
            skillsToAcquire: ['Kafka / RabbitMQ Event Streams', 'Distributed Tracing & OpenTelemetry', 'Kubernetes Helm Deployments'],
            recommendedProjects: ['Real-time Collaborative Canvas with WebSocket conflict resolution'],
            suggestedCertifications: ['CKAD (Certified Kubernetes Application Developer)'],
          },
          {
            phase: 'Phase 3: Proctored Mock Interviews & Salary Negotiation',
            duration: 'Weeks 9 - 12',
            focus: 'Rigorous live mock interview simulations, proctored environment conditioning, and compensation negotiation.',
            skillsToAcquire: ['STAR Behavioral Framework', 'Live Whiteboard System Design', 'Offer Equity Valuation & Negotiation'],
            recommendedProjects: ['Comprehensive Engineering Portfolio with Module 13 Verified Integrity Reports'],
            suggestedCertifications: ['Verified Module 13 AI Mock Interview Certificate'],
          },
        ],
      };

      return NextResponse.json({ success: true, roadmap });
    }

    // Default: Chat response from Career Advisor Agent
    const userMsg = (message || '').toLowerCase();
    let reply = `As your AI Career Copilot, I'm here to guide you toward landing your ideal ${role} role!`;
    const actions: { label: string; action: string }[] = [];

    if (userMsg.includes('system design') || userMsg.includes('design')) {
      reply = `For System Design interviews in ${role}:
1. **Framework**: Always start with Functional vs Non-Functional requirements, Back-of-the-envelope estimations (QPS, storage, bandwidth), API signatures, High-level diagram, and deep-dive bottlenecks.
2. **Hot Topics**: Token bucket rate limiting, Redis sliding window counters, WAL & MVCC in databases, and CDN caching tiers.
3. **Proctoring Tip**: Practice speaking your thought process aloud without looking away from your camera canvas!`;
      actions.push({ label: 'Practice System Design Interview', action: 'start_mock_design' });
      actions.push({ label: 'View 6-Month Roadmap', action: 'generate_roadmap' });
    } else if (userMsg.includes('roadmap') || userMsg.includes('path') || userMsg.includes('plan')) {
      reply = `I have updated your personalized 3-phase advancement roadmap for **${role}**. It highlights critical technical gaps like distributed locking, MVCC internals, and proctored interview practice.`;
      actions.push({ label: 'Generate Complete Roadmap', action: 'generate_roadmap' });
      actions.push({ label: 'Run Proctoring Assessment', action: 'start_mock' });
    } else if (userMsg.includes('salary') || userMsg.includes('compensation') || userMsg.includes('negotiate')) {
      reply = `Current 2026 market benchmarks for **${role}** (${experienceLevel || 'Mid-Level'}):
- **Base Salary**: $120,000 - $165,000
- **Total Compensation (incl. Equity & Bonus)**: $145,000 - $210,000
- **Top Negotiating Leverage**: Demonstrating verified mock interview reports with high integrity scores and real-world system architecture projects!`;
      actions.push({ label: 'Review My Skills Gap', action: 'analyze_skills' });
    } else if (userMsg.includes('resume') || userMsg.includes('portfolio') || userMsg.includes('project')) {
      reply = `To make your resume irresistible for ${role} hiring leads:
1. **Quantify impact**: Use the XYZ formula ("Accomplished [X] as measured by [Y] by doing [Z]").
2. **Anchor Project**: Showcase a production-grade project featuring concurrent state handling, distributed caching, and clean automated testing.
3. **Include Proctor Verification**: Attach your Module 13 Interview Integrity report link to verify authentic technical mastery.`;
      actions.push({ label: 'Generate Project Ideas', action: 'generate_roadmap' });
    } else {
      reply = `Great question! Based on your target role (**${role}**) and experience level (**${experienceLevel || 'Mid-Level'}**), the highest ROI focus right now is combining technical deep dives (React Concurrent rendering & distributed systems) with realistic proctored mock interview sessions to build interview endurance and articulate technical decisions under pressure.

How would you like to proceed?`;
      actions.push({ label: 'Generate My Personalized Roadmap', action: 'generate_roadmap' });
      actions.push({ label: 'Practice Module 13 Proctored Interview', action: 'start_mock' });
      actions.push({ label: 'Salary & Compensation Benchmark', action: 'salary_info' });
    }

    return NextResponse.json({
      success: true,
      reply,
      actions,
    });
  } catch (error: any) {
    console.error('Career guidance API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
