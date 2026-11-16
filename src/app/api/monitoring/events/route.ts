import { NextRequest, NextResponse } from 'next/server';
import { monitoringStore } from '@/lib/monitoringStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monitoring_session_id, event_type, duration_seconds, event_metadata, review_status } = body;

    if (!monitoring_session_id || !event_type) {
      return NextResponse.json({ error: 'monitoring_session_id and event_type are required' }, { status: 400 });
    }

    const event = await monitoringStore.addEvent({
      monitoring_session_id,
      event_type,
      duration_seconds: duration_seconds || 0,
      event_metadata: event_metadata || {},
      review_status: review_status || 'pending',
      event_timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding monitoring event:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId query parameter is required' }, { status: 400 });
    }

    const events = await monitoringStore.getEventsBySession(sessionId);
    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
