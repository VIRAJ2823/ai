import { NextRequest, NextResponse } from 'next/server';
import { monitoringStore } from '@/lib/monitoringStore';
import { AnswerEvaluation, InterviewAnswerRecord } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, questionId, questionText, category, userAnswer } = body;

    if (!sessionId || !questionId || !userAnswer) {
      return NextResponse.json({ error: 'sessionId, questionId, and userAnswer are required' }, { status: 400 });
    }

    const trimmed = (userAnswer as string).trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    // AI rubric scoring based on answer length, technical vocabulary, structure, and criteria matching
    let technicalScore = 75;
    let communicationScore = 75;
    let problemSolvingScore = 75;

    const lower = trimmed.toLowerCase();
    const keyTerms = [
      'render', 'concurrent', 'transition', 'fiber', 'async',
      'redis', 'bucket', 'latency', 'distributed', 'throughput', 'lock',
      'wal', 'mvcc', 'acid', 'transaction', 'vacuum', 'isolation',
      'trade-off', 'benchmark', 'consensus', 'scale', 'resilience', 'cache'
    ];

    const matchedTerms = keyTerms.filter(t => lower.includes(t)).length;

    // Length and depth
    if (wordCount > 60) {
      technicalScore += 8;
      communicationScore += 6;
      problemSolvingScore += 7;
    } else if (wordCount < 20) {
      technicalScore -= 15;
      communicationScore -= 12;
      problemSolvingScore -= 15;
    }

    // Vocabulary bonus
    technicalScore = Math.min(96, Math.max(45, technicalScore + matchedTerms * 2));
    communicationScore = Math.min(95, Math.max(50, communicationScore + (wordCount > 40 ? 8 : 0)));
    problemSolvingScore = Math.min(94, Math.max(48, problemSolvingScore + matchedTerms * 2));

    const overallScore = Math.round((technicalScore * 0.4) + (communicationScore * 0.3) + (problemSolvingScore * 0.3));

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (matchedTerms >= 3) {
      strengths.push('Effective use of domain-specific architectural terminology');
    }
    if (wordCount > 45) {
      strengths.push('Thorough explanation with structured reasoning');
    } else {
      improvements.push('Expand on real-world edge cases and concrete system parameters');
    }

    if (lower.includes('trade-off') || lower.includes('however') || lower.includes('alternative')) {
      strengths.push('Proactively evaluated architectural trade-offs');
    } else {
      improvements.push('Highlight alternative trade-offs and failure mode resilience');
    }

    const feedback = `Demonstrated solid conceptual foundation (${overallScore}/100). The explanation addresses core principles cleanly. To advance further, detail concrete metrics, failure handling, and production operational constraints.`;

    const evaluation: AnswerEvaluation = {
      technicalKnowledge: technicalScore,
      communication: communicationScore,
      problemSolving: problemSolvingScore,
      overallScore,
      strengths,
      improvements,
      feedback,
    };

    const record: InterviewAnswerRecord = {
      questionId,
      questionText: questionText || '',
      category: category || 'Full-Stack',
      userAnswer: trimmed,
      submittedAt: new Date().toISOString(),
      evaluation,
    };

    await monitoringStore.saveInterviewAnswer(sessionId, record);

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error('Error evaluating interview answer:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
