import { NextRequest, NextResponse } from 'next/server';
import { monitoringStore } from '@/lib/monitoringStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student_id, interview_session_id, camera_permission_status, monitoring_status } = body;

    const id = body.id || 'ses_' + Math.random().toString(36).substring(2, 11);
    const session = await monitoringStore.createSession({
      id,
      student_id: student_id || 'std_' + Math.random().toString(36).substring(2, 7),
      interview_session_id: interview_session_id || 'int_' + Math.random().toString(36).substring(2, 7),
      camera_permission_status: camera_permission_status || 'granted',
      monitoring_status: monitoring_status || 'active',
      started_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating monitoring session:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const updated = await monitoringStore.updateSession(id, updates);
    return NextResponse.json({ success: true, session: updated });
  } catch (error: any) {
    console.error('Error updating monitoring session:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await monitoringStore.getSession(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
