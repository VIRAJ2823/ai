import { NextRequest, NextResponse } from 'next/server';
import { monitoringStore } from '@/lib/monitoringStore';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const report = await monitoringStore.generateFullReport(sessionId);

    if (!report) {
      return NextResponse.json({ error: 'Session report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
