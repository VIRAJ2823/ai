import { InterviewQuestion } from './types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'Full-Stack',
    question: 'How does the React 18 Concurrent Renderer work, and how does `useTransition` prevent UI blocking during heavy state updates?',
    hint: 'Mention synchronous vs asynchronous rendering, interruptible renders, fiber tree transitions, and urgent vs non-urgent updates.',
    suggestedDurationMinutes: 3,
    expectedCriteria: [
      'Explanation of concurrent mode and interruptible rendering',
      'Distinction between urgent inputs (typing, clicking) and non-urgent transitions (filtering, large lists)',
      'Practical usage of useTransition and isPending state',
      'Fiber tree cloning and scheduling priorities',
    ],
  },
  {
    id: 'q2',
    category: 'System Design',
    question: 'Design a high-throughput, low-latency rate limiter for a public REST API. Which algorithms would you evaluate, and how would you store state across a distributed cluster?',
    hint: 'Compare Token Bucket, Leaky Bucket, Sliding Window Counter, and Redis Lua scripts with memory overhead considerations.',
    suggestedDurationMinutes: 4,
    expectedCriteria: [
      'Trade-offs between Token Bucket, Fixed Window, and Sliding Window Log/Counter',
      'Distributed synchronization using Redis or Memcached clusters',
      'Race conditions handling via Atomic Redis operations or Lua scripts',
      'Graceful degradation when the rate limiter storage experiences latency spikes',
    ],
  },
  {
    id: 'q3',
    category: 'Backend',
    question: 'Explain how PostgreSQL executes ACID transactions using Write-Ahead Logging (WAL) and Multi-Version Concurrency Control (MVCC). What happens during vacuuming?',
    hint: 'Discuss dirty reads vs repeatable reads, WAL sequence numbers, snapshot isolation, tuple visibility, and VACUUM/autovacuum mechanisms.',
    suggestedDurationMinutes: 3,
    expectedCriteria: [
      'WAL purpose: durability and recovery before committing changes to heap pages',
      'MVCC: xmin/xmax transaction visibility and row immutability',
      'Dead tuples generation during UPDATE and DELETE operations',
      'Autovacuum purpose in reclaiming storage and updating index statistics',
    ],
  },
  {
    id: 'q4',
    category: 'Behavioral',
    question: 'Describe a situation where you had a strong technical disagreement with a teammate or lead regarding architecture or trade-offs. How did you resolve it constructively?',
    hint: 'Use the STAR method: Situation, Task, Action, Result. Highlight data-driven decisions and professional empathy.',
    suggestedDurationMinutes: 3,
    expectedCriteria: [
      'Clear context and specific technical dispute explained neutrally',
      'Proactive approach: benchmarks, proof-of-concept, or RFC documentation',
      'Collaborative alignment rather than ego-driven debate',
      'Measurable outcome and retrospective lessons learned',
    ],
  },
];
